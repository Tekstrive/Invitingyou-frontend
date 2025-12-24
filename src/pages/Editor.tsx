import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import * as fabric from "fabric";
import type { ObjectProperties } from "../types/fabric";
import { FabricCanvas } from "../components/editor/FabricCanvas";
import { ColorPicker } from "../components/editor/ColorPicker";
import { TextToolbar } from "../components/editor/TextToolbar";
import { ImageUploader } from "../components/editor/ImageUploader";
import { EditorModuleSelector } from "../components/editor/EditorModuleSelector";
import type { EditorModule } from "../components/editor/EditorModuleSelector";
import {
  TextModule,
  BackgroundModule,
  LayersModule,
  StickersModule,
} from "../components/editor/modules";
import { useTemplate } from "../hooks/useTemplates";
import api from "../services/api";

/**
 * Editor page - Fabric.js canvas editor for customizing invitation templates
 * Stage 2.4: Save Design to Event
 */
export const Editor = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] =
    useState<fabric.FabricObject | null>(null);

  // Event state for saving
  const [eventId, setEventId] = useState<string | null>(
    searchParams.get("eventId")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [eventData, setEventData] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);

  // Fetch template data using React Query
  const {
    data: templateData,
    isLoading,
    isError,
    error,
  } = useTemplate(templateId || "");

  // History State for Undo/Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState<number>(-1);
  const processingRef = useRef(false);
  const skipLoadRef = useRef(false);

  // Module system state
  const [activeModule, setActiveModule] = useState<EditorModule>("text");

  // Design System Toggle (for future, forcing dark mode sidebars for now)
  // const isDarkMode = true;

  const historyStepRef = useRef(-1);
  useEffect(() => {
    historyStepRef.current = historyStep;
  }, [historyStep]);

  // Load event data if eventId is present (only on initial load, not after save)
  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;

      // Skip loading if we just saved (to avoid canvas reset)
      if (skipLoadRef.current) {
        skipLoadRef.current = false;
        return;
      }

      setLoadingEvent(true);
      try {
        const response = await api.get(`/api/events/${eventId}`);
        if (response.data.success && response.data.event) {
          setEventData(response.data.event);
        }
      } catch (err) {
        console.error("Failed to load event:", err);
        // If event not found, clear eventId
        setEventId(null);
        setSearchParams({});
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [eventId, setSearchParams]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y or Cmd+Shift+Z
      else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "z"))
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete: Delete or Backspace (only when not editing text)
      else if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedObject
      ) {
        // Check if we're editing text - don't delete if so
        const isEditingText =
          selectedObject.type === "i-text" &&
          (selectedObject as fabric.IText).isEditing;

        if (!isEditingText) {
          e.preventDefault();
          handleDeleteObject();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedObject, historyStep, history.length]);

  const handleDeleteObject = () => {
    if (!canvas || !selectedObject) return;

    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedObject(null);
    saveHistory(canvas);
  };

  // Function to save current state to history
  const saveHistory = (fabricCanvas: fabric.Canvas) => {
    if (processingRef.current) return;

    const json = JSON.stringify(fabricCanvas.toJSON());

    setHistory((prevHistory) => {
      const currentStep = historyStepRef.current;
      const newHistory = prevHistory.slice(0, currentStep + 1);

      if (newHistory.length > 0 && newHistory[newHistory.length - 1] === json) {
        return prevHistory;
      }

      return [...newHistory, json];
    });

    setHistoryStep((prevStep) => prevStep + 1);
  };

  const handleUndo = () => {
    if (historyStep <= 0 || !canvas) return;

    processingRef.current = true;
    const prevState = history[historyStep - 1];

    canvas.loadFromJSON(JSON.parse(prevState)).then(() => {
      canvas.renderAll();
      setHistoryStep(historyStep - 1);
      processingRef.current = false;
    });
  };

  const handleRedo = () => {
    if (historyStep >= history.length - 1 || !canvas) return;

    processingRef.current = true;
    const nextState = history[historyStep + 1];

    canvas.loadFromJSON(JSON.parse(nextState)).then(() => {
      canvas.renderAll();
      setHistoryStep(historyStep + 1);
      processingRef.current = false;
    });
  };

  const handleCanvasReady = (fabricCanvas: fabric.Canvas) => {
    setCanvas(fabricCanvas);

    // Save initial state
    saveHistory(fabricCanvas);

    // Set up history listeners
    const saveHandler = () => saveHistory(fabricCanvas);

    fabricCanvas.on("object:added", saveHandler);
    fabricCanvas.on("object:modified", saveHandler);
    fabricCanvas.on("object:removed", saveHandler);

    // Enable double-click to edit text
    fabricCanvas.on("mouse:dblclick", (e) => {
      const target = e.target;
      if (target && (target.type === "text" || target.type === "i-text")) {
        const textObject = target as any;
        if (typeof textObject.enterEditing === "function") {
          textObject.enterEditing();
          if (typeof textObject.selectAll === "function") {
            textObject.selectAll();
          }
        } else {
          textObject.set({ editable: true });
        }
        fabricCanvas.setActiveObject(textObject);
        fabricCanvas.renderAll();
      }
    });
  };

  const handleSelectionChange = (activeObject: fabric.FabricObject | null) => {
    setSelectedObject(activeObject);
  };

  // Handle text property updates from TextToolbar
  const handleTextUpdate = (properties: ObjectProperties) => {
    if (!canvas || !selectedObject) return;

    selectedObject.set(properties);
    canvas.renderAll();
    saveHistory(canvas);
    setSelectedObject(selectedObject);
  };

  // Save design to event
  const handleSaveDesign = async () => {
    if (!canvas || !templateId) return;

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const customData = canvas.toJSON();

      if (eventId) {
        // Update existing event
        await api.put(`/api/events/${eventId}`, { customData });
      } else {
        // Create new event
        const template = templateData?.data;
        const response = await api.post("/api/events", {
          templateId,
          title: template?.name || "My Invitation",
        });

        const newEventId = response.data._id;

        // Save customData to the new event FIRST
        await api.put(`/api/events/${newEventId}`, { customData });

        // Set flag to skip reload when URL changes
        skipLoadRef.current = true;

        // Then update state and URL
        setEventId(newEventId);
        setSearchParams({ eventId: newEventId });
      }

      setSaveStatus("saved");

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");

      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine which design data to use
  const getDesignData = () => {
    // If we have event data with customData, use that
    if (eventData?.customData) {
      return eventData.customData;
    }
    // Otherwise use template designData (which may be empty/undefined)
    return templateData?.data?.designData;
  };

  // Loading state
  if (isLoading || loadingEvent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loadingEvent ? "Loading your design..." : "Loading template..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-sm shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Template Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Could not load the template."}
          </p>
          <button
            onClick={() => navigate("/templates")}
            className="bg-brand-black text-white px-4 py-2 rounded-sm hover:bg-brand-black/90 transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  const template = templateData?.data;

  // Get save button text and style
  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case "saving":
        return (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </>
        );
      case "saved":
        return (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Saved!
          </>
        );
      case "error":
        return (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Error
          </>
        );
      default:
        return "Save Design";
    }
  };

  const getSaveButtonClass = () => {
    const baseClass =
      "px-4 py-2 rounded-sm transition-colors flex items-center";
    switch (saveStatus) {
      case "saved":
        return `${baseClass} bg-brand-black text-white`;
      case "error":
        return `${baseClass} bg-brand-black text-white`;
      default:
        return `${baseClass} bg-brand-black text-white hover:bg-brand-black/90`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Header - Fixed Height (64px) */}
      <div className="h-16 bg-white border-b border-gray-100 shrink-0 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/templates")}
                className="text-neutral-500 hover:text-brand-black transition-colors"
                title="Back to Templates"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-brand-black">
                  {template?.name || "Editor"}
                </h1>
                <p className="text-xs text-neutral-500 capitalize flex items-center">
                  {template?.category} template
                  {eventId && (
                    <span className="ml-2 flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                      Draft Saved
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Selection indicator */}
              {selectedObject && (
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Object Selected
                </span>
              )}
              {/* Save button */}
              <button
                className={getSaveButtonClass()}
                onClick={handleSaveDesign}
                disabled={isSaving}
              >
                {getSaveButtonContent()}
              </button>
              {/* Next button - only show when event is saved */}
              {eventId && saveStatus !== "saving" && (
                <button
                  onClick={() => navigate(`/event/details/${eventId}`)}
                  className="px-4 py-2 bg-brand-black text-white rounded-sm hover:bg-brand-black/90 transition-colors flex items-center"
                >
                  Next: Event Details
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Full screen flex */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Module Selector and Content */}
        <div className="w-80 bg-[#1e1e1e] border-r border-[#333] flex flex-col z-10 shrink-0 h-full overflow-y-auto custom-scrollbar text-white">
          <div className="p-4 space-y-6">
            {/* Module Selector */}
            <EditorModuleSelector
              activeModule={activeModule}
              onModuleChange={setActiveModule}
            />

            <div className="h-px bg-gray-700"></div>

            {/* Module Content */}
            <div className="min-h-[400px]">
              {activeModule === "text" && (
                <TextModule
                  canvas={canvas}
                  onTextAdded={() => {
                    if (canvas) saveHistory(canvas);
                  }}
                />
              )}

              {activeModule === "images" && (
                <ImageUploader
                  canvas={canvas}
                  onImageAdded={() => {
                    if (canvas) saveHistory(canvas);
                  }}
                />
              )}

              {activeModule === "background" && (
                <BackgroundModule
                  canvas={canvas}
                  onBackgroundChanged={() => {
                    if (canvas) saveHistory(canvas);
                  }}
                />
              )}

              {activeModule === "stickers" && (
                <StickersModule
                  canvas={canvas}
                  onStickerAdded={() => {
                    if (canvas) saveHistory(canvas);
                  }}
                />
              )}

              {activeModule === "layers" && (
                <LayersModule
                  canvas={canvas}
                  onLayerChange={() => {
                    if (canvas) saveHistory(canvas);
                  }}
                />
              )}

              {activeModule === "effects" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Premium Effects
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Unlock animations, shadows, and special effects
                  </p>
                  <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-sm hover:shadow-lg transition-all">
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-700"></div>

            {/* Undo/Redo Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleUndo}
                disabled={historyStep <= 0}
                className={`flex items-center justify-center py-2 px-3 text-sm font-medium rounded-sm transition-all ${
                  historyStep <= 0
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
                title="Undo (Ctrl+Z)"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                className={`flex items-center justify-center py-2 px-3 text-sm font-medium rounded-sm transition-all ${
                  historyStep >= history.length - 1
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                }`}
                title="Redo (Ctrl+Y)"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                  />
                </svg>
                Redo
              </button>
            </div>

            {/* Delete Button */}
            {selectedObject && (
              <>
                <div className="h-px bg-gray-700"></div>
                <button
                  onClick={handleDeleteObject}
                  className="flex items-center justify-center py-2 px-3 text-sm font-medium rounded-sm transition-all bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  title="Delete (Del)"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Object
                </button>
              </>
            )}
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 bg-brand-cream relative overflow-hidden flex flex-col items-center justify-center p-8 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-black/5">
            <FabricCanvas
              designData={getDesignData()}
              onCanvasReady={handleCanvasReady}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-[#1e1e1e] border-l border-[#333] flex flex-col z-2 shrink-0 h-full overflow-y-auto custom-scrollbar text-white">
          <div className="p-4 space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Properties
            </h3>

            {/* Text Toolbar - shows when text is selected */}
            {selectedObject && selectedObject.type === "i-text" && (
              <TextToolbar
                selectedObject={selectedObject}
                onUpdate={handleTextUpdate}
              />
            )}

            <ColorPicker
              selectedObject={selectedObject}
              onUpdate={handleTextUpdate}
            />

            {!selectedObject && (
              <div className="text-center py-10">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  Select an item to edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

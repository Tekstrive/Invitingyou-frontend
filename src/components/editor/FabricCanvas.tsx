import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

interface FabricCanvasProps {
  designData?: object;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onSelectionChange?: (activeObject: fabric.FabricObject | null) => void;
}

export const FabricCanvas = ({
  designData,
  onCanvasReady,
  onSelectionChange,
}: FabricCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);

  // State for responsive scaling
  const [scale, setScale] = useState(1);

  // Constants for the actual print size (e.g., 600x800)
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 800;

  // 1. Handle Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const padding = 40; // Space around the canvas

      // Calculate available space
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;

      // Calculate scale to fit
      const scaleX = availableWidth / CANVAS_WIDTH;
      const scaleY = availableHeight / CANVAS_HEIGHT;

      // Use the smaller scale to ensure it fits completely
      // Limit max scale to 1 (optional: remove logic if you want it to zoom in on huge screens)
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
    };

    // Initial calculation
    handleResize();

    // Observe container resize
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // 2. Initialize Fabric
  useEffect(() => {
    if (!containerRef.current || fabricRef.current) return;

    // Create canvas element
    const canvasEl = document.createElement("canvas");
    canvasEl.width = CANVAS_WIDTH;
    canvasEl.height = CANVAS_HEIGHT;
    canvasEl.style.display = "block";

    // We append it to a specific wrapper div (created in render)
    // instead of the main container to handle scaling better
    const canvasWrapper = document.getElementById("canvas-wrapper");
    if (canvasWrapper) {
      canvasWrapper.appendChild(canvasEl);
      canvasElRef.current = canvasEl;
    }

    const initTimeout = setTimeout(() => {
      if (!canvasElRef.current) return;

      try {
        const canvas = new fabric.Canvas(canvasElRef.current, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: "#ffffff",
          selection: true,
          // Fabric v6 specific: help it understand the CSS transform if needed
          controlsAboveOverlay: true,
        });

        fabricRef.current = canvas;
        setIsReady(true);

        // Selection Handlers
        canvas.on("selection:created", (e) =>
          onSelectionChange?.(e.selected?.[0] || null)
        );
        canvas.on("selection:updated", (e) =>
          onSelectionChange?.(e.selected?.[0] || null)
        );
        canvas.on("selection:cleared", () => onSelectionChange?.(null));

        onCanvasReady?.(canvas);
      } catch (err) {
        console.error("Error initializing Fabric canvas:", err);
      }
    }, 50);

    return () => {
      clearTimeout(initTimeout);
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
      if (canvasElRef.current && canvasWrapper) {
        // Check if child exists before removing
        if (canvasWrapper.contains(canvasElRef.current)) {
          canvasWrapper.removeChild(canvasElRef.current);
        }
        canvasElRef.current = null;
      }
      setIsReady(false);
    };
  }, []);

  // 3. Load designData when canvas is ready (only once on initial load)
  const hasLoadedDesignRef = useRef(false);

  useEffect(() => {
    // Only load if we have designData, canvas is ready, and we haven't loaded yet
    if (
      !designData ||
      !isReady ||
      !fabricRef.current ||
      hasLoadedDesignRef.current
    ) {
      return;
    }

    hasLoadedDesignRef.current = true;

    const canvas = fabricRef.current;

    canvas
      .loadFromJSON(designData)
      .then(() => {
        canvas.renderAll();
      })
      .catch((err: Error) => {
        console.error("Error loading design data:", err);
      });
  }, [designData, isReady]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden relative"
    >
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* The Wrapper handles the scaling. 
         We use CSS transform because it's performant and doesn't blur the canvas bitmap.
      */}
      <div
        id="canvas-wrapper"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // shadow-md
        }}
        className="bg-white transition-transform duration-200 ease-out"
      />
    </div>
  );
};

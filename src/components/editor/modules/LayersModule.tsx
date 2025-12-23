import * as fabric from "fabric";
import { Layers, Eye, EyeOff, Trash2, Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";

interface LayersModuleProps {
  canvas: fabric.Canvas | null;
  onLayerChange?: () => void;
}

interface LayerInfo {
  object: fabric.FabricObject;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

export const LayersModule = ({ canvas, onLayerChange }: LayersModuleProps) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayer, setSelectedLayer] =
    useState<fabric.FabricObject | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const layerInfos: LayerInfo[] = objects.map((obj, index) => {
        let name = `Layer ${index + 1}`;
        let type = obj.type || "object";

        if (obj.type === "i-text" || obj.type === "text") {
          const textObj = obj as fabric.IText;
          const text = textObj.text || "";
          name = text.length > 20 ? text.substring(0, 20) + "..." : text;
          type = "text";
        } else if (obj.type === "image") {
          name = "Image";
          type = "image";
        } else if (obj.type === "rect") {
          name = "Rectangle";
          type = "shape";
        } else if (obj.type === "circle") {
          name = "Circle";
          type = "shape";
        }

        return {
          object: obj,
          name,
          type,
          visible: obj.visible !== false,
          locked: obj.selectable === false,
        };
      });

      setLayers(layerInfos);
    };

    const handleSelection = () => {
      const active = canvas.getActiveObject();
      setSelectedLayer(active || null);
    };

    updateLayers();
    canvas.on("object:added", updateLayers);
    canvas.on("object:removed", updateLayers);
    canvas.on("object:modified", updateLayers);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedLayer(null));

    return () => {
      canvas.off("object:added", updateLayers);
      canvas.off("object:removed", updateLayers);
      canvas.off("object:modified", updateLayers);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
    };
  }, [canvas]);

  const selectLayer = (obj: fabric.FabricObject) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setSelectedLayer(obj);
  };

  const toggleVisibility = (obj: fabric.FabricObject) => {
    if (!canvas) return;
    obj.visible = !obj.visible;
    canvas.renderAll();
    onLayerChange?.();
  };

  const toggleLock = (obj: fabric.FabricObject) => {
    if (!canvas) return;
    obj.selectable = !obj.selectable;
    obj.evented = !obj.evented;
    canvas.renderAll();
    onLayerChange?.();
  };

  const deleteLayer = (obj: fabric.FabricObject) => {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.renderAll();
    onLayerChange?.();
  };

  const moveLayerUp = (obj: fabric.FabricObject) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const index = objects.indexOf(obj);
    if (index < objects.length - 1) {
      canvas.remove(obj);
      canvas.insertAt(index + 1, obj);
    }
    canvas.renderAll();
    onLayerChange?.();
  };

  const moveLayerDown = (obj: fabric.FabricObject) => {
    if (!canvas) return;
    const objects = canvas.getObjects();
    const index = objects.indexOf(obj);
    if (index > 0) {
      canvas.remove(obj);
      canvas.insertAt(index - 1, obj);
    }
    canvas.renderAll();
    onLayerChange?.();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return "T";
      case "image":
        return "🖼️";
      case "shape":
        return "◼";
      default:
        return "•";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Layers
        </h4>
        <p className="text-xs text-gray-400 mb-4">
          Manage all elements on your canvas
        </p>
      </div>

      {layers.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">No layers yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Add text or images to get started
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {layers.map((layer, index) => {
            const isSelected = selectedLayer === layer.object;

            return (
              <div
                key={index}
                className={`group rounded-sm transition-all ${
                  isSelected
                    ? "bg-brand-orange/20 border border-brand-orange"
                    : "bg-white/5 border border-transparent hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2 p-2">
                  {/* Type Icon */}
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelected
                        ? "bg-brand-orange text-white"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {getTypeIcon(layer.type)}
                  </div>

                  {/* Layer Name */}
                  <button
                    onClick={() => selectLayer(layer.object)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p
                      className={`text-sm font-medium truncate ${
                        isSelected ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {layer.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {layer.type}
                    </p>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleVisibility(layer.object)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      title={layer.visible ? "Hide" : "Show"}
                    >
                      {layer.visible ? (
                        <Eye className="w-4 h-4 text-gray-400" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleLock(layer.object)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      title={layer.locked ? "Unlock" : "Lock"}
                    >
                      {layer.locked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Unlock className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteLayer(layer.object)}
                      className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Layer Order Controls */}
                {isSelected && (
                  <div className="flex gap-1 px-2 pb-2">
                    <button
                      onClick={() => moveLayerUp(layer.object)}
                      className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300 transition-colors"
                    >
                      ↑ Forward
                    </button>
                    <button
                      onClick={() => moveLayerDown(layer.object)}
                      className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-gray-300 transition-colors"
                    >
                      ↓ Backward
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

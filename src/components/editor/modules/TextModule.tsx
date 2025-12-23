import * as fabric from "fabric";
import { Type, Plus } from "lucide-react";

interface TextModuleProps {
  canvas: fabric.Canvas | null;
  onTextAdded?: () => void;
}

const textPresets = [
  { label: "Heading", fontSize: 48, fontFamily: "Georgia", fontWeight: "bold" },
  {
    label: "Subheading",
    fontSize: 32,
    fontFamily: "Georgia",
    fontWeight: "normal",
  },
  {
    label: "Body Text",
    fontSize: 24,
    fontFamily: "Arial",
    fontWeight: "normal",
  },
  {
    label: "Small Text",
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "normal",
  },
];

export const TextModule = ({ canvas, onTextAdded }: TextModuleProps) => {
  const addText = (preset: (typeof textPresets)[0]) => {
    if (!canvas) return;

    const text = new fabric.IText("Double-click to edit", {
      left: canvas.width! / 2 - 100,
      top: canvas.height! / 2 - 12,
      fontSize: preset.fontSize,
      fontFamily: preset.fontFamily,
      fontWeight: preset.fontWeight as any,
      fill: "#000000",
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    onTextAdded?.();
  };

  const addCustomText = () => {
    if (!canvas) return;

    const text = new fabric.IText("Your text here", {
      left: canvas.width! / 2 - 75,
      top: canvas.height! / 2 - 12,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#000000",
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    onTextAdded?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Add Text
        </h4>
        <p className="text-xs text-gray-400 mb-4">
          Choose a text style or add custom text
        </p>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={addCustomText}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-orange hover:bg-brand-orange/90 text-white text-sm font-medium rounded-sm shadow-md hover:shadow-lg transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Custom Text
      </button>

      {/* Text Presets */}
      <div>
        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Text Presets
        </h5>
        <div className="space-y-2">
          {textPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => addText(preset)}
              className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-sm transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-brand-orange transition-colors">
                    {preset.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {preset.fontFamily} • {preset.fontSize}px
                  </p>
                </div>
                <Plus className="w-4 h-4 text-gray-500 group-hover:text-brand-orange transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-sm p-3">
        <p className="text-xs text-blue-300">
          <strong>Tip:</strong> Double-click any text on the canvas to edit it
          directly
        </p>
      </div>
    </div>
  );
};

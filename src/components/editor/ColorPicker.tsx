import { HexColorPicker } from "react-colorful";
import * as fabric from "fabric";
import type { ColorProperties } from "../../types/fabric";

interface ColorPickerProps {
  selectedObject: fabric.FabricObject | null;
  onUpdate: (properties: ColorProperties) => void;
}

/**
 * Color picker for Fabric.js objects
 * Shows when text or shape is selected
 */
export const ColorPicker = ({ selectedObject, onUpdate }: ColorPickerProps) => {
  // Only show if an object is selected
  if (!selectedObject) {
    return null;
  }

  // Get current fill color
  const currentColor = (selectedObject.fill as string) || "#000000";

  const handleColorChange = (color: string) => {
    onUpdate({ fill: color });
  };

  return (
    <div className="animate-fadeIn">
      <div className="space-y-3">
        {/* Color Picker */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <HexColorPicker
            color={currentColor}
            onChange={handleColorChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* Current Color Display */}
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">
              #
            </span>
            <input
              type="text"
              value={currentColor.replace("#", "")}
              onChange={(e) => handleColorChange(`#${e.target.value}`)}
              className="w-full pl-7 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
              placeholder="000000"
              pattern="[0-9A-Fa-f]{6}"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

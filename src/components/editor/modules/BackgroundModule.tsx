import * as fabric from "fabric";
import { Palette, Check, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { MediaLibrary } from "../MediaLibrary";
import type { Asset } from "../../../services/assetAPI";

interface BackgroundModuleProps {
  canvas: fabric.Canvas | null;
  onBackgroundChanged?: () => void;
}

const colorPresets = [
  { name: "White", color: "#FFFFFF" },
  { name: "Cream", color: "#FFF8F0" },
  { name: "Light Pink", color: "#FFE5E5" },
  { name: "Light Blue", color: "#E3F2FD" },
  { name: "Light Yellow", color: "#FFF9C4" },
  { name: "Light Green", color: "#E8F5E9" },
  { name: "Beige", color: "#F5F5DC" },
  { name: "Lavender", color: "#F3E5F5" },
  { name: "Mint", color: "#E0F2F7" },
  { name: "Peach", color: "#FFE4E1" },
  { name: "Black", color: "#000000" },
  { name: "Navy", color: "#1A1A2E" },
];

export const BackgroundModule = ({
  canvas,
  onBackgroundChanged,
}: BackgroundModuleProps) => {
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [currentBg, setCurrentBg] = useState("#FFFFFF");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const changeBackground = (color: string) => {
    if (!canvas) return;

    canvas.backgroundColor = color;
    canvas.renderAll();
    setCurrentBg(color);
    onBackgroundChanged?.();
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    changeBackground(color);
  };

  const handleSelectAsset = (asset: Asset) => {
    if (!canvas) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const assetUrl = asset.url.startsWith("/assets")
      ? `${apiUrl}${asset.url}`
      : asset.url;

    // Set background image
    fabric.FabricImage.fromURL(assetUrl).then((img) => {
      canvas.backgroundImage = img;
      img.scaleToWidth(canvas.width!);
      img.scaleToHeight(canvas.height!);
      canvas.renderAll();
      onBackgroundChanged?.();
    });

    setShowMediaLibrary(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Background
          </h4>
          <p className="text-xs text-gray-400 mb-4">
            Choose a background color or image for your invitation
          </p>
        </div>

        {/* Browse Backgrounds Button */}
        <button
          onClick={() => setShowMediaLibrary(true)}
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-3 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          Browse Backgrounds
        </button>

        {/* Custom Color Picker */}
        <div className="bg-white/5 rounded-sm p-4">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Custom Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-12 h-12 rounded-sm cursor-pointer border-2 border-white/10"
            />
            <div className="flex-1">
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    changeBackground(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-sm text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Color Presets
          </h5>
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.color}
                onClick={() => changeBackground(preset.color)}
                className="relative group"
                title={preset.name}
              >
                <div
                  className="w-full aspect-square rounded-sm border-2 transition-all"
                  style={{
                    backgroundColor: preset.color,
                    borderColor:
                      currentBg === preset.color
                        ? "#FF6B35"
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  {currentBg === preset.color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center truncate group-hover:text-white transition-colors">
                  {preset.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onSelectAsset={handleSelectAsset}
          onClose={() => setShowMediaLibrary(false)}
          defaultCategory="background"
        />
      )}
    </>
  );
};

import { useState } from "react";
import { Sticker } from "lucide-react";
import { MediaLibrary } from "../MediaLibrary";
import type { Asset } from "../../../services/assetAPI";
import * as fabric from "fabric";

interface StickersModuleProps {
  canvas: fabric.Canvas | null;
  onStickerAdded?: () => void;
}

export const StickersModule = ({
  canvas,
  onStickerAdded,
}: StickersModuleProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleSelectSticker = (asset: Asset) => {
    if (!canvas) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const assetUrl = asset.url.startsWith("/assets")
      ? `${apiUrl}${asset.url}`
      : asset.url;

    // Add sticker to canvas
    if (asset.type === "svg" || asset.url.endsWith(".svg")) {
      // Load SVG
      fabric.loadSVGFromURL(assetUrl).then(({ objects, options }) => {
        const filteredObjects = objects.filter(
          (obj): obj is fabric.FabricObject => obj !== null
        );
        const svg = fabric.util.groupSVGElements(filteredObjects, options);

        // Position in center of canvas
        svg.set({
          left: canvas.width! / 2 - svg.width! / 2,
          top: canvas.height! / 2 - svg.height! / 2,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        canvas.add(svg);
        canvas.setActiveObject(svg);
        canvas.renderAll();
        onStickerAdded?.();
      });
    } else {
      // Load regular image
      fabric.FabricImage.fromURL(assetUrl).then((img) => {
        // Position in center of canvas
        img.set({
          left: canvas.width! / 2 - img.width! / 4,
          top: canvas.height! / 2 - img.height! / 4,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        onStickerAdded?.();
      });
    }

    setShowMediaLibrary(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Sticker className="w-4 h-4" />
            Stickers & Graphics
          </h4>
          <p className="text-xs text-gray-400 mb-4">
            Add fun stickers and decorative elements to your invitation
          </p>
        </div>

        {/* Browse Stickers Button */}
        <button
          onClick={() => setShowMediaLibrary(true)}
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-3 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Sticker className="w-4 h-4" />
          Browse Stickers
        </button>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-sm p-3">
          <div className="flex items-start gap-2">
            <Sticker className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-300 mb-1">
                How to Use Stickers
              </p>
              <p className="text-xs text-blue-400/80">
                Click "Browse Stickers" to add decorative elements. Resize and
                position them on your card.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onSelectAsset={handleSelectSticker}
          onClose={() => setShowMediaLibrary(false)}
          defaultCategory="sticker"
        />
      )}
    </>
  );
};

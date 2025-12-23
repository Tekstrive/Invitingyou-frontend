import { useState } from "react";
import {
  Sticker,
  PartyPopper,
  Heart,
  Baby,
  Snowflake,
  Gift,
} from "lucide-react";
import { MediaLibrary } from "../MediaLibrary";
import type { Asset } from "../../../services/assetAPI";
import * as fabric from "fabric";

interface StickersModuleProps {
  canvas: fabric.Canvas | null;
  onStickerAdded?: () => void;
}

// Quick emoji categories
const EMOJI_CATEGORIES = [
  {
    name: "Party",
    icon: PartyPopper,
    emojis: [
      "🎉",
      "🎊",
      "🎈",
      "🎂",
      "🎁",
      "🎀",
      "🪅",
      "🎯",
      "🎪",
      "🎭",
      "🥳",
      "✨",
    ],
  },
  {
    name: "Wedding",
    icon: Heart,
    emojis: [
      "💒",
      "💍",
      "👰",
      "🤵",
      "💐",
      "🕊️",
      "🥂",
      "💝",
      "🌹",
      "❤️",
      "💕",
      "💗",
    ],
  },
  {
    name: "Baby",
    icon: Baby,
    emojis: [
      "👶",
      "🍼",
      "🧸",
      "🎀",
      "👣",
      "🧷",
      "🌟",
      "🦋",
      "🐣",
      "🧁",
      "🎠",
      "💫",
    ],
  },
  {
    name: "Holiday",
    icon: Snowflake,
    emojis: [
      "🎄",
      "🎅",
      "⭐",
      "❄️",
      "☃️",
      "🎆",
      "🎇",
      "🕯️",
      "🔔",
      "🦌",
      "🎁",
      "✨",
    ],
  },
  {
    name: "Celebration",
    icon: Gift,
    emojis: [
      "🏆",
      "🎓",
      "🎖️",
      "🏅",
      "🥇",
      "🎗️",
      "🎀",
      "🌸",
      "🌺",
      "🌻",
      "🌼",
      "🍾",
    ],
  },
];

export const StickersModule = ({
  canvas,
  onStickerAdded,
}: StickersModuleProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);

  const handleAddEmoji = (emoji: string) => {
    if (!canvas) return;

    const text = new fabric.IText(emoji, {
      left: canvas.width! / 2 - 30,
      top: canvas.height! / 2 - 30,
      fontSize: 60,
      fontFamily:
        "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    onStickerAdded?.();
  };

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

  const ActiveCategory = EMOJI_CATEGORIES[activeEmojiCategory];

  return (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Sticker className="w-4 h-4" />
            Stickers & Emojis
          </h4>
        </div>

        {/* Quick Emoji Categories */}
        <div className="flex gap-1 mb-2">
          {EMOJI_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveEmojiCategory(idx)}
                className={`flex-1 p-2 rounded-sm transition-colors ${
                  activeEmojiCategory === idx
                    ? "bg-brand-orange text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
                title={cat.name}
              >
                <Icon className="w-4 h-4 mx-auto" />
              </button>
            );
          })}
        </div>

        {/* Emoji Grid */}
        <div className="bg-white/5 rounded-sm p-2">
          <p className="text-xs text-gray-400 mb-2">{ActiveCategory.name}</p>
          <div className="grid grid-cols-6 gap-1">
            {ActiveCategory.emojis.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => handleAddEmoji(emoji)}
                className="aspect-square flex items-center justify-center text-2xl hover:bg-white/20 rounded-sm transition-colors"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-700" />

        {/* Browse More Stickers Button */}
        <button
          onClick={() => setShowMediaLibrary(true)}
          className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-3 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Sticker className="w-4 h-4" />
          Browse More Stickers
        </button>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-sm p-3">
          <div className="flex items-start gap-2">
            <Sticker className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-300 mb-1">
                Quick Tips
              </p>
              <p className="text-xs text-blue-400/80">
                Click any emoji to add it instantly. Use "Browse More Stickers"
                for decorative graphics and SVG elements.
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

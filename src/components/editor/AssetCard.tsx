import { useState } from "react";
import type { Asset } from "../../services/assetAPI";

interface AssetCardProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
  isSelected?: boolean;
}

export const AssetCard = ({
  asset,
  onSelect,
  isSelected = false,
}: AssetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getAssetUrl = () => {
    // For local assets, prepend the backend URL
    if (asset.url.startsWith("/assets")) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      return `${apiUrl}${asset.url}`;
    }
    return asset.url;
  };

  return (
    <div
      onClick={() => onSelect(asset)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative aspect-square rounded-sm overflow-hidden cursor-pointer
        transition-all duration-200
        ${isSelected ? "ring-2 ring-brand-orange shadow-lg" : "hover:shadow-md"}
        ${isHovered ? "scale-105" : "scale-100"}
      `}
    >
      {/* Asset Image/Pattern */}
      <div className="w-full h-full bg-gray-100">
        {!imageError ? (
          <img
            src={getAssetUrl()}
            alt={asset.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs text-center px-1">
              Preview unavailable
            </span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-white text-center px-2">
            <p className="text-sm font-medium truncate">{asset.name}</p>
            {asset.tags.length > 0 && (
              <p className="text-xs opacity-80 mt-1">
                {asset.tags.slice(0, 2).join(", ")}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-brand-orange rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      )}

      {/* Premium Badge */}
      {asset.isPremium && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-sm font-medium">
          PRO
        </div>
      )}
    </div>
  );
};

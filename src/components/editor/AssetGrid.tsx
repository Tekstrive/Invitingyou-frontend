import { AssetCard } from "./AssetCard";
import type { Asset } from "../../services/assetAPI";

interface AssetGridProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  selectedAssetId?: string;
  isLoading?: boolean;
}

export const AssetGrid = ({
  assets,
  onSelectAsset,
  selectedAssetId,
  isLoading = false,
}: AssetGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm font-medium">No assets found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {assets.map((asset) => (
        <AssetCard
          key={asset._id}
          asset={asset}
          onSelect={onSelectAsset}
          isSelected={asset._id === selectedAssetId}
        />
      ))}
    </div>
  );
};

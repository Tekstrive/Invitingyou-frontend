import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { AssetGrid } from "./AssetGrid";
import { useAssets } from "../../hooks/useAssets";
import type { Asset } from "../../services/assetAPI";

interface MediaLibraryProps {
  onSelectAsset: (asset: Asset) => void;
  onClose: () => void;
  defaultCategory?: "background" | "sticker" | "text-decoration";
}

type TabType = "backgrounds" | "stickers" | "uploads";

const BACKGROUND_SUBCATEGORIES = [
  { id: "all", label: "All Backgrounds" },
  { id: "solid", label: "Solid Colors" },
  { id: "gradients", label: "Gradients" },
  { id: "patterns", label: "Patterns" },
  { id: "textures", label: "Textures" },
  { id: "themed", label: "Themed" },
];

const STICKER_SUBCATEGORIES = [
  { id: "all", label: "All Stickers" },
  { id: "celebrations", label: "Celebrations" },
  { id: "decorative", label: "Decorative" },
  { id: "seasonal", label: "Seasonal" },
  { id: "icons", label: "Icons" },
];

export const MediaLibrary = ({
  onSelectAsset,
  onClose,
  defaultCategory = "background",
}: MediaLibraryProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(
    defaultCategory === "background" ? "backgrounds" : "stickers"
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string>();

  // Determine category and subcategory for API call
  const apiParams = useMemo(() => {
    const params: Record<string, string | number> = {};

    if (activeTab === "backgrounds") {
      params.category = "background";
      if (selectedSubcategory !== "all") {
        params.subcategory = selectedSubcategory;
      }
    } else if (activeTab === "stickers") {
      params.category = "sticker";
      if (selectedSubcategory !== "all") {
        params.subcategory = selectedSubcategory;
      }
    }

    return params;
  }, [activeTab, selectedSubcategory]);

  const { data: assets = [], isLoading } = useAssets(apiParams);

  // Filter assets by search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;

    const query = searchQuery.toLowerCase();
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [assets, searchQuery]);

  const handleSelectAsset = (asset: Asset) => {
    setSelectedAssetId(asset._id);
    onSelectAsset(asset);
  };

  const handleApply = () => {
    if (selectedAssetId) {
      const asset = assets.find((a) => a._id === selectedAssetId);
      if (asset) {
        onSelectAsset(asset);
        onClose();
      }
    }
  };

  const subcategories =
    activeTab === "backgrounds"
      ? BACKGROUND_SUBCATEGORIES
      : STICKER_SUBCATEGORIES;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-brand-mirage">
            Media Library
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-sm transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => {
              setActiveTab("backgrounds");
              setSelectedSubcategory("all");
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "backgrounds"
                ? "text-brand-orange border-b-2 border-brand-orange"
                : "text-gray-600 hover:text-brand-mirage"
            }`}
          >
            Backgrounds
          </button>
          <button
            onClick={() => {
              setActiveTab("stickers");
              setSelectedSubcategory("all");
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "stickers"
                ? "text-brand-orange border-b-2 border-brand-orange"
                : "text-gray-600 hover:text-brand-mirage"
            }`}
          >
            Stickers
          </button>
          <button
            onClick={() => setActiveTab("uploads")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "uploads"
                ? "text-brand-orange border-b-2 border-brand-orange"
                : "text-gray-600 hover:text-brand-mirage"
            }`}
          >
            My Uploads
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Categories */}
          {activeTab !== "uploads" && (
            <div className="w-48 border-r p-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {subcategories.map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => setSelectedSubcategory(subcat.id)}
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                      selectedSubcategory === subcat.id
                        ? "bg-brand-orange text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {subcat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Asset Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "uploads" ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Upload Feature Coming Soon
                  </p>
                  <p className="text-xs mt-1">
                    You'll be able to upload your own images
                  </p>
                </div>
              ) : (
                <AssetGrid
                  assets={filteredAssets}
                  onSelectAsset={handleSelectAsset}
                  selectedAssetId={selectedAssetId}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredAssets.length}{" "}
            {filteredAssets.length === 1 ? "asset" : "assets"}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!selectedAssetId}
              className={`px-4 py-2 rounded-sm transition-colors ${
                selectedAssetId
                  ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

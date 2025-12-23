import { useNavigate } from "react-router-dom";
import { Eye, Sparkles, Heart } from "lucide-react";
import { useState } from "react";
import { TemplatePreview } from "./TemplatePreview";
import type { CanvasDesignData } from "../../types/fabric";

interface TemplateCardProps {
  _id: string;
  name: string;
  category: string;
  subcategory?: string;
  style?: string;
  thumbnail: string;
  designData?: CanvasDesignData;
  features?: string[];
  isPremium?: boolean;
  onQuickView?: (id: string) => void;
}

export const TemplateCard = ({
  _id,
  name,
  category,
  subcategory,
  style,
  thumbnail,
  designData,
  features = [],
  isPremium = false,
  onQuickView,
}: TemplateCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    navigate(`/editor/${_id}`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(_id);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Category display names
  const categoryNames: { [key: string]: string } = {
    birthday: "Birthday",
    wedding: "Wedding",
    "baby-shower": "Baby Shower",
    baby_shower: "Baby Shower",
    party: "Party",
    holiday: "Holiday",
    christmas: "Christmas",
    other: "Other",
  };

  // Subcategory display names
  const subcategoryNames: { [key: string]: string } = {
    kids: "Kids",
    teen: "Teen",
    adult: "Adult",
    milestone: "Milestone",
    themed: "Themed",
    formal: "Formal",
    casual: "Casual",
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-transparent overflow-hidden transition-all duration-300 cursor-pointer group"
    >
      {/* Invitation Preview Area */}
      <div className="aspect-[3/4] bg-[#F4F4F4] relative overflow-hidden flex items-center justify-center p-8 transition-colors duration-300 group-hover:bg-[#EBEBEB]">
        {/* The "Physical" Card Effect */}
        <div className="relative w-full h-full shadow-lg transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-xl bg-white">
          {designData ? (
            <TemplatePreview
              designData={designData}
              fallbackThumbnail={thumbnail}
              className="w-full h-full object-cover"
            />
          ) : thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🎉
            </div>
          )}

          {/* Favoriting Heart */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Hover Overlay Actions */}
        {isHovered && onQuickView && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center animate-in fade-in duration-200">
            <button
              onClick={handleQuickView}
              className="px-5 py-2.5 bg-brand-mirage text-white rounded-full font-semibold text-sm hover:bg-black transition-all shadow-xl transform translate-y-4 animate-in slide-in-from-bottom-2"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Card Content Footer */}
      <div className="py-4 px-1">
        {isPremium && (
          <div className="flex items-center gap-1.5 text-[#D10074] mb-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Premium Invitation
            </span>
          </div>
        )}

        {!isPremium && (
          <div className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            Standard Invitation
          </div>
        )}

        <h4 className="text-lg font-medium text-brand-mirage mb-0.5 truncate leading-tight">
          {name}
        </h4>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span>{categoryNames[category] || category}</span>
          {subcategory && (
            <>
              <span className="text-gray-300">•</span>
              <span>{subcategoryNames[subcategory] || subcategory}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

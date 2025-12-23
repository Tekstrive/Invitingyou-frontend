import { X, Sparkles, Calendar, Users, MapPin } from "lucide-react";
import type { Template } from "../../services/templateAPI";
import { useNavigate } from "react-router-dom";

interface TemplateQuickViewProps {
  template: Template;
  onClose: () => void;
}

export const TemplateQuickView = ({
  template,
  onClose,
}: TemplateQuickViewProps) => {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    navigate(`/editor/${template._id}`);
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

  const subcategoryNames: { [key: string]: string } = {
    kids: "Kids",
    teen: "Teen",
    adult: "Adult",
    milestone: "Milestone",
    themed: "Themed",
    formal: "Formal",
    casual: "Casual",
  };

  const styleNames: { [key: string]: string } = {
    modern: "Modern",
    classic: "Classic",
    playful: "Playful",
    elegant: "Elegant",
    minimalist: "Minimalist",
    vintage: "Vintage",
    festive: "Festive",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-sm shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-brand-mirage flex items-center gap-2">
              {template.name}
              {template.isPremium && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Premium
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <span className="capitalize">
                {categoryNames[template.category] || template.category}
              </span>
              {template.subcategory && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize text-brand-sea">
                    {subcategoryNames[template.subcategory] ||
                      template.subcategory}
                  </span>
                </>
              )}
              {template.style && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="capitalize text-brand-orange">
                    {styleNames[template.style] || template.style}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-sm transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Preview */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden shadow-lg">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-sand to-brand-sea/20">
                  <span className="text-6xl">🎨</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-brand-mirage mb-3">
                Template Features
              </h3>
              {template.features && template.features.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-brand-sand text-brand-mirage text-sm font-medium rounded-full capitalize"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No features listed</p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg text-brand-mirage mb-3">
                Perfect For
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-orange mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-mirage">Event Type</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {categoryNames[template.category] || template.category}
                      {template.subcategory &&
                        ` - ${
                          subcategoryNames[template.subcategory] ||
                          template.subcategory
                        }`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand-orange mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-mirage">Style</p>
                    <p className="text-sm text-gray-600 capitalize">
                      {template.style
                        ? styleNames[template.style] || template.style
                        : "Versatile"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-orange mt-0.5" />
                  <div>
                    <p className="font-medium text-brand-mirage">
                      Customization
                    </p>
                    <p className="text-sm text-gray-600">
                      Fully editable text, colors, and layout
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {template.isPremium && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-sm p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">
                      Premium Template
                    </p>
                    <p className="text-sm text-yellow-800">
                      This template includes premium features and advanced
                      customization options.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleUseTemplate}
              className="w-full px-6 py-3 bg-brand-orange text-white font-semibold rounded-sm hover:bg-brand-orange/90 transition-colors shadow-md hover:shadow-lg"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

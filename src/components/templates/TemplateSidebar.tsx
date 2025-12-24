import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface TemplateSidebarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: "popular" | "newest";
  onSortChange: (sort: "popular" | "newest") => void;
}

const subcategories = [
  { id: "all", label: "All Templates", count: 0 },
  { id: "kids", label: "Kids Birthday", count: 0 },
  { id: "teen", label: "Teen Birthday", count: 0 },
  { id: "adult", label: "Adult Birthday", count: 0 },
  { id: "milestone", label: "Milestone", count: 0 },
  { id: "themed", label: "Themed Parties", count: 0 },
];

const priceFilters = [
  { id: "all", label: "All Templates" },
  { id: "free", label: "Free Only" },
  { id: "premium", label: "Premium Only" },
];

export const TemplateSidebar = ({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
}: TemplateSidebarProps) => {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Sort Section */}
        <div className="bg-white rounded-sm border border-brand-sea/10 p-6">
          <h3 className="font-bold text-brand-mirage mb-4 flex items-center justify-between">
            Sort By
            <ChevronDown className="w-4 h-4" />
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onSortChange("popular")}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-sm transition-colors text-sm font-medium",
                sortBy === "popular"
                  ? "bg-brand-cream text-brand-black"
                  : "text-brand-black hover:bg-brand-cream-light"
              )}
            >
              Most Popular
            </button>
            <button
              onClick={() => onSortChange("newest")}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-sm transition-colors text-sm font-medium",
                sortBy === "newest"
                  ? "bg-brand-cream text-brand-black"
                  : "text-brand-black hover:bg-brand-cream-light"
              )}
            >
              Newest First
            </button>
          </div>
        </div>

        {/* Category Filter Section */}
        <div className="bg-white rounded-sm border border-brand-sea/10 p-6">
          <h3 className="font-bold text-brand-mirage mb-4 flex items-center justify-between">
            Categories
            <ChevronDown className="w-4 h-4" />
          </h3>
          <div className="space-y-1">
            {subcategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-sm transition-colors text-sm font-medium flex items-center justify-between",
                  activeFilter === category.id
                    ? "bg-brand-cream text-brand-black"
                    : "text-brand-black hover:bg-brand-cream-light"
                )}
              >
                <span>{category.label}</span>
                {category.count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      activeFilter === category.id
                        ? "bg-white/20"
                        : "bg-brand-sand"
                    )}
                  >
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Filter Section */}
        <div className="bg-white rounded-sm border border-brand-sea/10 p-6">
          <h3 className="font-bold text-brand-mirage mb-4 flex items-center justify-between">
            Price
            <ChevronDown className="w-4 h-4" />
          </h3>
          <div className="space-y-2">
            {priceFilters.map((filter) => (
              <label
                key={filter.id}
                className="flex items-center gap-3 px-4 py-2.5 rounded-sm hover:bg-brand-sand cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="price"
                  value={filter.id}
                  defaultChecked={filter.id === "all"}
                  className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                />
                <span className="text-sm font-medium text-brand-mirage">
                  {filter.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button className="w-full px-4 py-2.5 text-sm font-medium text-brand-orange hover:text-brand-orange/80 transition-colors">
          Clear All Filters
        </button>
      </div>
    </aside>
  );
};

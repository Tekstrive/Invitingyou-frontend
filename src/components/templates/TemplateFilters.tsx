import { cn } from "../../lib/utils";

interface TemplateFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "all", label: "All Templates" },
  { id: "kids", label: "Kids" },
  { id: "teen", label: "Teen" },
  { id: "adult", label: "Adult" },
  { id: "milestone", label: "Milestone" },
  { id: "themed", label: "Themed" },
];

export const TemplateFilters = ({
  activeFilter,
  onFilterChange,
}: TemplateFiltersProps) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex gap-3 pb-4 min-w-max px-4 sm:px-6 lg:px-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap",
              activeFilter === filter.id
                ? "bg-brand-orange text-white shadow-md shadow-orange-200/50"
                : "bg-brand-sand text-brand-mirage hover:bg-brand-sand/80 border border-brand-sea/10"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

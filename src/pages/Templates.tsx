import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTemplates } from "../hooks/useTemplates";
import { TemplateCard } from "../components/templates/TemplateCard";
import { TemplateSidebar } from "../components/templates/TemplateSidebar";
import { TemplateQuickView } from "../components/templates/TemplateQuickView";
import { MainLayout } from "../components/layout/MainLayout";
import type { Template } from "../services/templateAPI";
import { cn } from "../lib/utils";

export const Templates = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular");
  const [quickViewTemplate, setQuickViewTemplate] = useState<Template | null>(
    null
  );

  // Fetch templates using React Query
  const { data, isLoading, isError, error } = useTemplates(
    category || undefined
  );

  // Category display names
  const categoryNames: { [key: string]: string } = {
    birthday: "Birthday",
    wedding: "Wedding",
    christmas: "Christmas",
    baby_shower: "Baby Shower",
    party: "Party",
    holiday: "Holiday",
    other: "Other",
  };

  const categoryDescriptions: { [key: string]: string } = {
    birthday:
      "Create stunning birthday invitations that set the perfect tone for your celebration. From kids' parties to milestone birthdays, find the perfect design.",
    wedding:
      "Elegant wedding invitations for your special day. Beautiful designs to announce your celebration of love.",
    christmas:
      "Festive Christmas party invitations to spread holiday cheer and gather your loved ones.",
    baby_shower:
      "Sweet baby shower invitations to celebrate the upcoming arrival of your little one.",
    party:
      "Fun party invitations for any occasion. Make your celebration memorable from the first invite.",
    holiday:
      "Holiday-themed invitations for all your seasonal celebrations throughout the year.",
    other:
      "Explore our diverse collection of invitation templates for every occasion.",
  };

  const displayCategory = category
    ? categoryNames[category] || category
    : "All";

  const displayDescription = category
    ? categoryDescriptions[category] ||
      "Browse our collection of invitation templates"
    : "Browse our complete collection of invitation templates for every occasion";

  // Filter and sort templates (frontend-only for now)
  const filteredTemplates = useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    // Apply subcategory filter (simulated - will be backend later)
    if (activeFilter !== "all") {
      // For now, just return all since we don't have subcategory data
      // Backend will handle this later
      filtered = filtered;
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort(() => {
        // Simulated - will use actual dates from backend
        return Math.random() - 0.5;
      });
    }

    return filtered;
  }, [data, activeFilter, sortBy]);

  const handleQuickView = (templateId: string) => {
    const template = data?.data.find((t) => t._id === templateId);
    if (template) {
      setQuickViewTemplate(template);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-brand-sand relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#16232A_1px,_transparent_1px)] [background-size:24px_24px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-mirage mb-6">
                {displayCategory} Invitations
              </h1>
              <p className="text-lg md:text-xl text-brand-mirage/70 leading-relaxed">
                {displayDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Hidden on mobile, visible on lg+ */}
            <div className="hidden lg:block">
              <TemplateSidebar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>

            {/* Mobile Filters - Visible only on mobile */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-brand-mirage">Filters</h3>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "popular" | "newest")
                  }
                  className="px-4 py-2 rounded-sm border border-brand-sea/20 text-sm font-medium text-brand-mirage bg-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                {["all", "kids", "teen", "adult", "milestone", "themed"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors",
                        activeFilter === filter
                          ? "bg-brand-cream text-brand-black"
                          : "bg-brand-cream-light text-brand-black/80"
                      )}
                    >
                      {filter === "all"
                        ? "All"
                        : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Templates Content */}
            <div className="flex-1 min-w-0">
              {/* Count and Sort - Desktop only */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="text-sm text-brand-mirage/60">
                  {!isLoading && data && (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-brand-mirage">
                        {filteredTemplates.length}
                      </span>{" "}
                      {filteredTemplates.length === 1
                        ? "template"
                        : "templates"}
                    </>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-brand-sand rounded-sm mb-4" />
                      <div className="h-4 bg-brand-sand rounded w-3/4 mb-2" />
                      <div className="h-3 bg-brand-sand rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-sm p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    Error loading templates
                  </h3>
                  <p className="text-red-600">
                    {error instanceof Error
                      ? error.message
                      : "Something went wrong. Please try again later."}
                  </p>
                </div>
              )}

              {/* Templates Grid */}
              {!isLoading && !isError && data && (
                <>
                  {filteredTemplates.length === 0 ? (
                    <div className="bg-brand-sand/30 rounded-sm p-12 text-center">
                      <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-10 h-10 text-brand-orange"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-brand-mirage mb-4">
                        No Templates Found
                      </h2>
                      <p className="text-brand-mirage/60 mb-6">
                        We don't have any {displayCategory.toLowerCase()}{" "}
                        templates yet. Check back soon!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTemplates.map((template) => (
                        <TemplateCard
                          key={template._id}
                          _id={template._id}
                          name={template.name}
                          category={template.category}
                          subcategory={template.subcategory}
                          style={template.style}
                          thumbnail={template.thumbnail}
                          designData={template.designData}
                          features={template.features}
                          isPremium={template.isPremium}
                          onQuickView={handleQuickView}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - Why Choose */}
        {!isLoading && !isError && category && (
          <div className="bg-brand-sand/30 py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-mirage mb-6">
                Why Choose Our {displayCategory} Invitations?
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-mirage/70 leading-relaxed mb-4">
                  When celebrating {displayCategory.toLowerCase()} events, the
                  invitation is your guests' first look at your special
                  occasion. It's important to choose an invitation that reflects
                  the personality and theme of your celebration.
                </p>
                <p className="text-brand-mirage/70 leading-relaxed">
                  Our {displayCategory.toLowerCase()} invitations stand out with
                  custom designs, free personalization, and convenient sharing
                  options. Create the perfect invite that captures the spirit of
                  your special day!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewTemplate && (
          <TemplateQuickView
            template={quickViewTemplate}
            onClose={() => setQuickViewTemplate(null)}
          />
        )}
      </div>
    </MainLayout>
  );
};

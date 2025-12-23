import { Link } from "react-router-dom";
import { LivingCard } from "../ui/LivingCard";
import { Sparkles } from "lucide-react";

const seasonalItems = [
  {
    id: "christmas",
    title: "Holiday Cheer",
    image:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1000&auto=format&fit=crop",
    size: "large",
  },
  {
    id: "new-year",
    title: "New Year's Eve",
    image:
      "https://images.unsplash.com/photo-1576158142340-9e63cd272421?q=80&w=1000&auto=format&fit=crop",
    size: "small",
  },
  {
    id: "winter-party",
    title: "Winter Gala",
    image:
      "https://images.unsplash.com/photo-1482517967863-00e15c9b4499?q=80&w=1000&auto=format&fit=crop",
    size: "small",
  },
];

export const SeasonalGrid = () => {
  return (
    <section className="py-24 bg-brand-sand relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-bold tracking-wide uppercase mb-4 border border-brand-orange/20">
            <Sparkles className="w-4 h-4 mr-2" /> Season's Greetings
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-mirage">
            Holiday Favorites
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Large Card (Spans 2 cols on tablet+, 1 on mobile) */}
          <div className="md:col-span-2">
            <Link to="/templates?category=christmas">
              <LivingCard
                image={seasonalItems[0].image}
                title={seasonalItems[0].title}
                subtitle="Shop Collection"
                className="h-[400px]"
                aspectRatio="landscape"
              />
            </Link>
          </div>

          {/* Stacked Small Cards */}
          <div className="space-y-8">
            <Link to="/templates?category=new-year">
              <LivingCard
                image={seasonalItems[1].image}
                title={seasonalItems[1].title}
                className="h-[184px]"
                aspectRatio="landscape"
              />
            </Link>
            <Link to="/templates?category=winter">
              <LivingCard
                image={seasonalItems[2].image}
                title={seasonalItems[2].title}
                className="h-[184px]"
                aspectRatio="landscape"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

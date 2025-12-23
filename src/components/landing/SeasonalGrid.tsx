import { Link } from "react-router-dom";
import { LivingCard } from "../ui/LivingCard";
import { Gift } from "lucide-react";

const seasonalItems = [
  {
    id: "christmas",
    title: "Holiday Cheer",
    image: "/images/christmas-cheer.png",
    size: "large",
  },
  {
    id: "new-year",
    title: "New Year's Eve",
    image: "/images/new-years-eve.png",
    size: "small",
  },
  {
    id: "winter-party",
    title: "Winter Gala",
    image: "/images/winter-gala.png",
    size: "small",
  },
];

export const SeasonalGrid = () => {
  return (
    <section className="py-24 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-bold tracking-wide uppercase mb-4 border border-brand-gold/20">
            <Gift className="w-4 h-4 mr-2" /> Season's Greetings
          </span>
          <h2 className="text-3xl md:text-5xl text-brand-charcoal">
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

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { LivingCard } from "../ui/LivingCard";

export const CategorySpotlight = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-mirage mb-4">
              Celebrate Life's Moments
            </h2>
            <p className="text-brand-mirage/60 max-w-md">
              Whether it's the start of a new year or a new chapter in love,
              find the design that speaks to you.
            </p>
          </div>
          <Link
            to="/templates"
            className="flex items-center text-brand-mirage font-medium hover:text-brand-orange transition-colors group"
          >
            View All Categories{" "}
            <ArrowUpRight className="ml-2 w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wedding Spotlight */}
          <div className="relative group">
            <Link to="/templates?category=wedding">
              <LivingCard
                image="/images/wedding-hero.jpg"
                title="Weddings"
                subtitle="Elegant & Timeless"
                aspectRatio="landscape"
                className="h-[400px] md:h-[500px]"
              />
            </Link>
          </div>

          {/* Birthday Spotlight */}
          <div className="relative group mt-12 md:mt-0">
            <Link to="/templates?category=birthday">
              <LivingCard
                image="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=1000&auto=format&fit=crop"
                title="Birthdays"
                subtitle="Fun & Festive"
                aspectRatio="landscape"
                className="h-[400px] md:h-[500px]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

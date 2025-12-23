import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowRight, Heart, Gift, Cake, GlassWater } from "lucide-react";
import { Link } from "react-router-dom";

const journeySteps = [
  {
    id: "engagement",
    title: "She Said Yes",
    subtitle: "Engagement Parties",
    icon: Heart,
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80",
    color: "bg-rose-50 text-rose-600",
  },
  {
    id: "wedding",
    title: "The Big Day",
    subtitle: "Wedding Invitations",
    icon: GlassWater,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
    color: "bg-brand-cream text-brand-gold",
  },
  {
    id: "baby",
    title: "New Beginnings",
    subtitle: "Baby Shower",
    icon: Gift,
    image:
      "https://images.unsplash.com/photo-1557823568-1eb8ee09f221?auto=format&fit=crop&q=80",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "birthday",
    title: "Growing Up",
    subtitle: "First Birthday",
    icon: Cake,
    image:
      "https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&q=80",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    id: "holidays",
    title: "Together Forever",
    subtitle: "Holiday Cards",
    icon: ArrowRight,
    image:
      "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&q=80",
    color: "bg-green-50 text-green-600",
  },
];

export const LifeJourneyScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-mirage mb-4">
            For Every Chapter of Your Story
          </h2>
          <p className="text-brand-mirage/60 max-w-lg">
            From saying "I do" to celebrating milestones, InvitingYou is there
            to help you gather your loved ones.
          </p>
        </div>

        {/* Scroll Progress Bar (Desktop) */}
        <div className="hidden md:block w-48 h-1 bg-brand-sand rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-orange"
            style={{ scaleX: scrollXProgress, transformOrigin: "left" }}
          />
        </div>
      </div>

      {/* Main Scroll Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory pb-12 px-4 sm:px-6 lg:px-8 gap-6 -mx-4 sm:mx-0 hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.id}
                to={`/templates?category=${step.id}`}
                className="flex-none snap-center w-[300px] group relative"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-sm relative shadow-md group-hover:shadow-xl transition-all duration-500">
                  {/* Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${step.image})` }}
                  />

                  {/* Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-brand-mirage/90 via-brand-mirage/50 to-transparent">
                    <div
                      className={`inline-flex items-center justify-center p-3 rounded-full mb-4 bg-white/10 backdrop-blur-md text-white`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {step.title}
                    </h3>
                    <p className="text-white/80 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Connector Line (Design Element) */}
                {index !== journeySteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-brand-orange/20" />
                )}
              </Link>
            );
          })}

          {/* Spacer for right padding in scrolling container */}
          <div className="w-4 shrink-0" />
        </div>

        {/* Fade Gradient Overlay - Right Side */}
        <div className="absolute right-0 top-0 bottom-12 w-24 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none hidden md:block" />

        {/* Scroll Hint Text - Mobile */}
        <div className="md:hidden text-center mt-2 text-sm text-brand-mirage/40">
          ← Swipe to explore →
        </div>
      </div>
    </div>
  );
};

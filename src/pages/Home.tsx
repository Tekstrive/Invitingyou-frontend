import { MainLayout } from "../components/layout/MainLayout";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { EmotionalBenefits } from "../components/landing/EmotionalBenefits";
import { CategorySpotlight } from "../components/landing/CategorySpotlight";
import { LifeJourneyScroll } from "../components/landing/LifeJourneyScroll";
import { SeasonalGrid } from "../components/landing/SeasonalGrid";
import { Link } from "react-router-dom";
import { Sparkles, Upload, Palette, Calendar } from "lucide-react";

export const Home = () => {
  const quickActions = [
    {
      icon: Sparkles,
      title: "Browse Templates",
      description: "Explore our stunning collection",
      link: "/templates",
      color: "bg-brand-orange",
    },
    {
      icon: Upload,
      title: "Upload Your Own",
      description: "Personalize in seconds",
      link: "/templates?filter=upload",
      color: "bg-brand-sea",
    },
    {
      icon: Palette,
      title: "Design It Yourself",
      description: "Create from scratch",
      link: "/templates?filter=custom",
      color: "bg-brand-mirage",
    },
    {
      icon: Calendar,
      title: "View Dashboard",
      description: "Manage your events",
      link: "/dashboard",
      color: "bg-brand-orange",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Original Hero Section */}
        <Hero />

        {/* Evite-Style Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-mirage mb-4 text-center">
            What do you want to do today?
          </h2>
          <p className="text-center text-brand-mirage/60 mb-12 text-lg">
            Choose your path to the perfect invitation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group bg-white border-2 border-brand-sea/10 rounded-sm p-8 hover:border-brand-orange hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`${action.color} w-16 h-16 rounded-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-mirage mb-2">
                    {action.title}
                  </h3>
                  <p className="text-brand-mirage/60">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Original Features Section */}
        <Features />

        {/* Original Category Spotlight */}
        <CategorySpotlight />

        {/* Original Emotional Benefits */}
        <EmotionalBenefits />

        {/* Original Envelope Opening Animation */}
        {/* <EnvelopeOpening /> */}

        {/* Original Life Journey Scroll */}
        <LifeJourneyScroll />

        {/* Original Seasonal Grid */}
        <SeasonalGrid />
      </div>
    </MainLayout>
  );
};

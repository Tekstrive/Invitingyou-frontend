import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import {
  Menu,
  X,
  ChevronDown,
  Cake,
  Heart,
  Gift,
  PartyPopper,
  Snowflake,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../lib/utils";

// Category data with icons and subcategories for mega menu
const megaMenuCategories = [
  {
    name: "Birthday",
    slug: "birthday",
    icon: Cake,
    description: "Celebrate another year",
    subcategories: ["Kids", "Adult", "Milestone", "Themed"],
  },
  {
    name: "Wedding",
    slug: "wedding",
    icon: Heart,
    description: "Your perfect day",
    subcategories: ["Save the Date", "Ceremony", "Reception", "Engagement"],
  },
  {
    name: "Baby Shower",
    slug: "baby-shower",
    icon: Gift,
    description: "Welcome little ones",
    subcategories: ["Boy", "Girl", "Gender Neutral", "Virtual"],
  },
  {
    name: "Parties",
    slug: "party",
    icon: PartyPopper,
    description: "Let's celebrate",
    subcategories: ["Graduation", "Retirement", "Housewarming", "Cocktail"],
  },
  {
    name: "Holidays",
    slug: "christmas",
    icon: Snowflake,
    description: "Seasonal greetings",
    subcategories: ["Christmas", "New Year", "Thanksgiving", "Easter"],
  },
];

// Trending item type
interface TrendingItem {
  _id: string;
  title: string;
  categorySlug: string;
  templateId?: {
    _id: string;
    name: string;
    thumbnail: string;
  };
  thumbnailUrl?: string;
}

export const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [trendingMenuOpen, setTrendingMenuOpen] = useState(false);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const location = useLocation();

  // Fetch trending items
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/trending`);
        const data = await res.json();
        if (data.success) {
          setTrendingItems(data.items);
        }
      } catch (error) {
        console.error("Error fetching trending items:", error);
      }
    };
    fetchTrending();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setTrendingMenuOpen(false);
    window.scrollTo(0, 0);
    setScrolled(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const showSolidBackground =
    scrolled || !isHome || megaMenuOpen || trendingMenuOpen;

  const handleMouseLeaveNav = () => {
    setMegaMenuOpen(false);
    setTrendingMenuOpen(false);
  };

  // Get unique categories from trending items
  const trendingCategories = [
    ...new Set(trendingItems.map((item) => item.title)),
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        showSolidBackground
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
      onMouseLeave={handleMouseLeaveNav}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-50">
            <Logo variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Categories Dropdown Trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => {
                  setMegaMenuOpen(true);
                  setTrendingMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-sm",
                  megaMenuOpen
                    ? "text-brand-orange bg-brand-orange/5"
                    : "text-brand-charcoal/80 hover:text-brand-orange"
                )}
              >
                Categories
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    megaMenuOpen && "rotate-180"
                  )}
                />
              </button>
            </div>

            {/* Trending Dropdown Trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => {
                  setTrendingMenuOpen(true);
                  setMegaMenuOpen(false);
                }}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-sm",
                  trendingMenuOpen
                    ? "text-brand-orange bg-brand-orange/5"
                    : "text-brand-charcoal/80 hover:text-brand-orange"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    trendingMenuOpen && "rotate-180"
                  )}
                />
              </button>
            </div>

            {/* Quick Links */}
            <Link
              to="/templates"
              className="px-4 py-2 text-sm font-medium text-brand-charcoal/80 hover:text-brand-orange transition-colors rounded-sm"
            >
              All Templates
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-24 h-8 bg-brand-charcoal/10 animate-pulse rounded-full" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-brand-charcoal/60 truncate max-w-[120px]">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <Link to="/dashboard">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-sm btn-premium"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-brand-charcoal/60 hover:text-red-500"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand-charcoal hover:text-brand-orange"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-sm border-brand-charcoal/20"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-sm btn-premium"
                  >
                    Create Invitation
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-charcoal z-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Categories Mega Menu Dropdown */}
      <div
        className={cn(
          "absolute left-0 right-0 bg-white shadow-premium-hover border-t border-brand-charcoal/5 transition-all duration-300 overflow-hidden",
          megaMenuOpen
            ? "opacity-100 visible max-h-[400px]"
            : "opacity-0 invisible max-h-0"
        )}
        onMouseEnter={() => {
          setMegaMenuOpen(true);
          setTrendingMenuOpen(false);
        }}
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-5 gap-6">
            {megaMenuCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.slug}
                  to={`/templates?category=${category.slug}`}
                  className="group p-4 rounded-sm hover:bg-brand-ivory transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-sm bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-charcoal group-hover:text-brand-orange transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-brand-charcoal/50">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 pl-11">
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <div
                        key={sub}
                        className="text-sm text-brand-charcoal/60 hover:text-brand-orange cursor-pointer"
                      >
                        {sub}
                      </div>
                    ))}
                    <div className="text-sm text-brand-orange font-medium pt-1">
                      View all →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending Menu Dropdown - Greetings Island Style */}
      <div
        className={cn(
          "absolute left-0 right-0 bg-gradient-to-b from-purple-50 to-white shadow-premium-hover border-t border-brand-charcoal/5 transition-all duration-300 overflow-hidden",
          trendingMenuOpen
            ? "opacity-100 visible max-h-[500px]"
            : "opacity-0 invisible max-h-0"
        )}
        onMouseEnter={() => {
          setTrendingMenuOpen(true);
          setMegaMenuOpen(false);
        }}
        onMouseLeave={() => setTrendingMenuOpen(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Left: Category Links */}
            <div className="w-48 border-r border-brand-charcoal/10 pr-8">
              <h3 className="text-sm font-semibold text-brand-charcoal/40 uppercase tracking-wider mb-4">
                What's Hot
              </h3>
              <div className="space-y-3">
                {trendingCategories.length > 0 ? (
                  trendingCategories.map((title) => (
                    <Link
                      key={title}
                      to={`/templates?trending=${encodeURIComponent(title)}`}
                      className="block text-brand-charcoal hover:text-brand-orange transition-colors font-medium"
                    >
                      {title}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      to="/templates?category=christmas"
                      className="block text-brand-charcoal hover:text-brand-orange transition-colors font-medium"
                    >
                      Christmas cards
                    </Link>
                    <Link
                      to="/templates?category=new-year"
                      className="block text-brand-charcoal hover:text-brand-orange transition-colors font-medium"
                    >
                      New year cards
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right: Template Previews */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-6">
                {trendingItems.length > 0 ? (
                  trendingItems.slice(0, 3).map((item) => (
                    <Link
                      key={item._id}
                      to={`/templates?category=${item.categorySlug}`}
                      className="group"
                    >
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50 shadow-md group-hover:shadow-lg transition-all mb-3">
                        {item.thumbnailUrl || item.templateId?.thumbnail ? (
                          <img
                            src={
                              item.thumbnailUrl || item.templateId?.thumbnail
                            }
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🎉
                          </div>
                        )}
                      </div>
                      <p className="text-center text-sm font-medium text-brand-charcoal group-hover:text-brand-orange transition-colors">
                        {item.title}
                      </p>
                    </Link>
                  ))
                ) : (
                  // Placeholder cards when no trending items
                  <>
                    <Link to="/templates?category=christmas" className="group">
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-gradient-to-br from-green-100 to-red-50 shadow-md group-hover:shadow-lg transition-all mb-3 flex items-center justify-center">
                        <span className="text-6xl">🎄</span>
                      </div>
                      <p className="text-center text-sm font-medium text-brand-charcoal group-hover:text-brand-orange transition-colors">
                        Christmas cards
                      </p>
                    </Link>
                    <Link to="/templates?category=new-year" className="group">
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-50 shadow-md group-hover:shadow-lg transition-all mb-3 flex items-center justify-center">
                        <span className="text-6xl">🎆</span>
                      </div>
                      <p className="text-center text-sm font-medium text-brand-charcoal group-hover:text-brand-orange transition-colors">
                        New year invites
                      </p>
                    </Link>
                    <Link to="/templates?category=new-year" className="group">
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-gradient-to-br from-purple-100 to-pink-50 shadow-md group-hover:shadow-lg transition-all mb-3 flex items-center justify-center">
                        <span className="text-6xl">🥂</span>
                      </div>
                      <p className="text-center text-sm font-medium text-brand-charcoal group-hover:text-brand-orange transition-colors">
                        New year invites
                      </p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-4">
          {/* Trending Link on Mobile */}
          <Link
            to="/templates?trending=true"
            className="flex items-center gap-3 p-4 rounded-sm bg-gradient-to-r from-purple-50 to-pink-50 transition-colors"
          >
            <div className="p-2 rounded-sm bg-brand-orange/10 text-brand-orange">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-lg font-medium text-brand-charcoal">
              Trending
            </span>
          </Link>

          {megaMenuCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to={`/templates?category=${category.slug}`}
                className="flex items-center gap-3 p-4 rounded-sm hover:bg-brand-ivory transition-colors"
              >
                <div className="p-2 rounded-sm bg-brand-orange/10 text-brand-orange">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium text-brand-charcoal">
                  {category.name}
                </span>
              </Link>
            );
          })}

          <div className="h-px bg-brand-charcoal/10 my-4" />

          {isLoading ? (
            <div className="w-full h-12 bg-brand-charcoal/10 animate-pulse rounded-sm" />
          ) : isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-lg font-medium text-brand-charcoal p-4"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-lg font-medium text-red-500 text-left p-4"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base rounded-sm"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="primary"
                  className="w-full h-12 text-base rounded-sm"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <Link to="/templates" className="mt-4">
            <Button
              variant="secondary"
              className="w-full h-14 text-base rounded-sm btn-premium"
            >
              Create an Invitation
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

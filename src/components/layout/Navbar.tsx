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
  Star,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

// Icon mapping for categories
const categoryIcons: Record<string, LucideIcon> = {
  birthday: Cake,
  wedding: Heart,
  "baby-shower": Gift,
  party: PartyPopper,
  christmas: Snowflake,
  holiday: Snowflake,
  holidays: Snowflake,
  other: Star,
  default: Calendar,
};

// Category type from API
interface CategoryFromAPI {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories?: string[];
}

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

// Default fallback categories
const defaultCategories: CategoryFromAPI[] = [
  {
    _id: "1",
    name: "Birthday",
    slug: "birthday",
    description: "Celebrate another year",
    subcategories: ["Kids", "Adult", "Milestone", "Themed"],
  },
  {
    _id: "2",
    name: "Wedding",
    slug: "wedding",
    description: "Your perfect day",
    subcategories: ["Save the Date", "Ceremony", "Reception", "Engagement"],
  },
  {
    _id: "3",
    name: "Baby Shower",
    slug: "baby-shower",
    description: "Welcome little ones",
    subcategories: ["Boy", "Girl", "Gender Neutral"],
  },
  {
    _id: "4",
    name: "Parties",
    slug: "party",
    description: "Let's celebrate",
    subcategories: ["Graduation", "Retirement", "Housewarming"],
  },
  {
    _id: "5",
    name: "Holidays",
    slug: "christmas",
    description: "Seasonal greetings",
    subcategories: ["Christmas", "New Year", "Thanksgiving"],
  },
];

export const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [trendingMenuOpen, setTrendingMenuOpen] = useState(false);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [categories, setCategories] =
    useState<CategoryFromAPI[]>(defaultCategories);
  const location = useLocation();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/api/categories`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
                    ? "text-brand-black bg-brand-cream-light"
                    : "text-brand-black/80 hover:text-brand-black"
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
                    ? "text-brand-black bg-brand-cream-light"
                    : "text-brand-black/80 hover:text-brand-black"
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
              className="px-4 py-2 text-sm font-medium text-brand-black/80 hover:text-brand-black transition-colors rounded-sm"
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
                <span className="text-sm text-brand-black/60 truncate max-w-[120px]">
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
                  className="text-brand-black/60 hover:text-brand-black"
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
                    className="text-brand-black hover:text-brand-black/80"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-sm border-brand-black/20"
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
            className="md:hidden p-2 text-brand-black z-50"
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
          "absolute left-0 right-0 bg-white shadow-premium-hover border-t border-brand-cream/20 transition-all duration-300 overflow-hidden",
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
            {categories.slice(0, 5).map((category) => {
              const Icon =
                categoryIcons[category.slug] || categoryIcons.default;
              return (
                <Link
                  key={category._id}
                  to={`/templates?category=${category.slug}`}
                  className="group p-4 rounded-sm hover:bg-brand-cream-light transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-sm bg-brand-cream-light text-brand-black group-hover:bg-brand-black group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-black group-hover:text-brand-black transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-brand-black/50">
                        {category.description || "Browse templates"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 pl-11">
                    {(category.subcategories || []).slice(0, 3).map((sub) => (
                      <div
                        key={sub}
                        className="text-sm text-brand-black/60 hover:text-brand-black cursor-pointer"
                      >
                        {sub}
                      </div>
                    ))}
                    <div className="text-sm text-brand-black font-medium pt-1">
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
          "absolute left-0 right-0 bg-gradient-to-b from-brand-cream-light to-white shadow-premium-hover border-t border-brand-cream/20 transition-all duration-300 overflow-hidden",
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
            <div className="w-48 border-r border-brand-cream pr-8">
              <h3 className="text-sm font-semibold text-brand-black/40 uppercase tracking-wider mb-4">
                What's Hot
              </h3>
              <div className="space-y-3">
                {trendingCategories.length > 0 ? (
                  trendingCategories.map((title) => (
                    <Link
                      key={title}
                      to={`/templates?trending=${encodeURIComponent(title)}`}
                      className="block text-brand-black hover:text-brand-black/70 transition-colors font-medium"
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
                  trendingItems.slice(0, 3).map((item) => {
                    const titleLower = item.title.toLowerCase();
                    let displayImage =
                      item.thumbnailUrl || item.templateId?.thumbnail;

                    // Fallback to local images based on title if no API thumbnail
                    if (!displayImage) {
                      if (titleLower.includes("christmas"))
                        displayImage = "/images/christmas-cheer.png";
                      else if (
                        titleLower.includes("new year") ||
                        titleLower.includes("year")
                      )
                        displayImage = "/images/new-years-eve.png";
                      else if (titleLower.includes("wedding"))
                        displayImage = "/images/wedding-hero.jpg";
                    }

                    return (
                      <Link
                        key={item._id}
                        to={`/templates?category=${item.categorySlug}`}
                        className="group"
                      >
                        <div className="aspect-[3/4] rounded-sm overflow-hidden bg-brand-cream-light shadow-md group-hover:shadow-lg transition-all mb-3 relative">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl bg-brand-cream/20 text-brand-black">
                              🎉
                            </div>
                          )}
                        </div>
                        <p className="text-center text-sm font-medium text-brand-black group-hover:text-brand-black/80 transition-colors">
                          {item.title}
                        </p>
                      </Link>
                    );
                  })
                ) : (
                  // Placeholder cards when no trending items
                  <>
                    <Link to="/templates?category=christmas" className="group">
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-brand-cream-light shadow-md group-hover:shadow-lg transition-all mb-3 relative">
                        <img
                          src="/images/christmas-cheer.png"
                          alt="Christmas Card"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-center text-sm font-medium text-brand-black group-hover:text-brand-black/80 transition-colors">
                        Christmas cards
                      </p>
                    </Link>
                    <Link to="/templates?category=new-year" className="group">
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-brand-cream-light shadow-md group-hover:shadow-lg transition-all mb-3 relative">
                        <img
                          src="/images/new-years-eve.png"
                          alt="New Year Card"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-center text-sm font-medium text-brand-black group-hover:text-brand-black/80 transition-colors">
                        New year invites
                      </p>
                    </Link>
                    <Link to="/templates?category=wedding" className="group">
                      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-brand-cream-light shadow-md group-hover:shadow-lg transition-all mb-3 relative">
                        <img
                          src="/images/wedding-hero.jpg"
                          alt="Wedding Invitation"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-center text-sm font-medium text-brand-black group-hover:text-brand-black/80 transition-colors">
                        Wedding invites
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
            className="flex items-center gap-3 p-4 rounded-sm bg-brand-cream-light transition-colors"
          >
            <div className="p-2 rounded-sm bg-brand-cream text-brand-black">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-lg font-medium text-brand-black">
              Trending
            </span>
          </Link>

          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || categoryIcons.default;
            return (
              <Link
                key={category._id}
                to={`/templates?category=${category.slug}`}
                className="flex items-center gap-3 p-4 rounded-sm hover:bg-brand-cream-light transition-colors"
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

          <div className="h-px bg-brand-cream my-4" />

          {isLoading ? (
            <div className="w-full h-12 bg-brand-cream-light animate-pulse rounded-sm" />
          ) : isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-lg font-medium text-brand-black p-4"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-lg font-medium text-brand-black text-left p-4"
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

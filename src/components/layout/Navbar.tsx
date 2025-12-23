import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";

export const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Reset scroll state when navigating to a new page
    window.scrollTo(0, 0);
    setScrolled(false);
  }, [location.pathname]);

  const categories = [
    { name: "Birthday", slug: "birthday" },
    { name: "Wedding", slug: "wedding" },
    { name: "Holidays", slug: "christmas" },
    { name: "Parties", slug: "party" },
  ];

  const isHome = location.pathname === "/";
  const showSolidBackground = scrolled || !isHome;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        showSolidBackground
          ? "bg-white/90 backdrop-blur-md border-brand-sea/20 shadow-sm py-2"
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-50">
            <Logo variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/templates?category=${category.slug}`}
                className="text-brand-mirage/80 hover:text-brand-orange font-medium text-sm transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoading ? (
              <div className="w-24 h-8 bg-brand-sea/10 animate-pulse rounded-full" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-brand-mirage/70 truncate max-w-[120px]">
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <div className="h-4 w-px bg-brand-sea/30" />
                <Link to="/dashboard">
                  <Button
                    variant="secondary"
                    className="rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-brand-mirage hover:text-brand-orange"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" className="rounded-full px-6">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/templates">
                  <Button
                    variant="secondary"
                    className="rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all"
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
            className="md:hidden p-2 text-brand-mirage z-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-brand-sand/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 md:hidden transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/templates?category=${category.slug}`}
              className="text-2xl font-medium text-brand-mirage hover:text-brand-orange border-b border-brand-sea/10 pb-4"
            >
              {category.name}
            </Link>
          ))}
          <div className="h-px bg-brand-sea/20 my-4" />
          {isLoading ? (
            <div className="w-full h-12 bg-brand-sea/10 animate-pulse rounded-full" />
          ) : isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-xl font-medium text-brand-mirage"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-xl font-medium text-red-500 text-left"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg border-brand-mirage/20 text-brand-mirage"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="primary"
                  className="w-full h-12 text-lg bg-brand-mirage"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          <Link to="/templates" className="mt-4">
            <Button
              variant="secondary"
              className="w-full h-14 text-lg rounded-full shadow-orange-200/50"
            >
              Create an Invitation
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

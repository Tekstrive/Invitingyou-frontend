import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Star, Shield, Heart } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative bg-brand-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-brand-ivory sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left page-transition">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full mb-6">
                <Star className="w-4 h-4 text-brand-gold" />
                <span className="text-sm font-medium text-brand-gold">
                  No ads, ever. Just beautiful designs.
                </span>
              </div>

              <h1 className="text-4xl tracking-tight text-brand-charcoal sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Celebrations start with a</span>{" "}
                <span className="block text-brand-orange mt-2">
                  stunning invitation.
                </span>
              </h1>

              <p className="mt-6 text-lg text-brand-charcoal/60 sm:mt-8 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-8 md:text-xl lg:mx-0 font-light leading-relaxed">
                Create elegant, ad-free online invitations for weddings,
                birthdays, and life's special moments. Experience the joy of
                gathering.
              </p>

              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <div>
                  <Link to="/templates">
                    <Button
                      size="lg"
                      className="w-full md:w-auto text-lg px-10 py-4 rounded-sm btn-premium"
                    >
                      Browse Designs
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Link to="/templates">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full md:w-auto text-lg px-10 py-4 rounded-sm border-brand-charcoal/20 text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all"
                    >
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-brand-charcoal/50 sm:justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>1000+ Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Loved by 50k+ Hosts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>Premium Quality</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full transition-transform duration-1000 hover:scale-105"
          src="/hero-bg.png"
          alt="Elegant Party Setup"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ivory via-brand-ivory/60 to-transparent lg:via-brand-ivory/20"></div>
      </div>
    </section>
  );
};

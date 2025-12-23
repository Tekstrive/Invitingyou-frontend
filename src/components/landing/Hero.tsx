import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const Hero = () => {
  return (
    <section className="relative bg-brand-sand overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-brand-sand sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl tracking-tight font-bold text-brand-mirage sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  Celebrations start with a
                </span>{" "}
                <span className="block text-brand-orange xl:inline">
                  stunning invitation.
                </span>
              </h1>
              <p className="mt-3 text-base text-brand-mirage/70 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 font-light">
                Create elegant, ad-free online invitations for weddings,
                birthdays, and parties. Experience the joy of gathering with our
                premium design suite.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-sm shadow">
                  <Link to="/templates">
                    <Button
                      size="lg"
                      className="w-full md:w-auto text-lg px-8 rounded-sm shadow-orange-200/50"
                    >
                      Browse Designs
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/templates">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full md:w-auto text-lg px-8 rounded-sm border-brand-orange/50 text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange"
                    >
                      View Demo
                    </Button>
                  </Link>
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
        <div className="absolute inset-0 bg-gradient-to-r from-brand-sand via-brand-sand/60 to-transparent lg:via-brand-sand/20"></div>
      </div>
    </section>
  );
};

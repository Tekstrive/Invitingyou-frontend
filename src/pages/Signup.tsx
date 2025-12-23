import { Link } from "react-router-dom";
import { SignupForm } from "../components/auth/SignupForm";
import { Logo } from "../components/ui/Logo";

export const Signup = () => {
  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 order-2 lg:order-1">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-brand-black">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Start designing beautiful invitations today.
            </p>
          </div>

          <div className="mt-8">
            <SignupForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-brand-gold hover:text-yellow-600 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side (visually right on desktop) - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-sage relative items-center justify-center overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1530103862676-de3c9a59af38?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10 p-12 text-center">
          <Logo variant="light" className="text-5xl justify-center mb-8" />
          <p className="text-white text-xl max-w-md mx-auto leading-relaxed">
            "Every celebration starts with an invitation."
          </p>
        </div>
      </div>
    </div>
  );
};

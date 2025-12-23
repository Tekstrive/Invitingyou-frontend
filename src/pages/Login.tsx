import { Link } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { Logo } from "../components/ui/Logo";

export const Login = () => {
  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-black relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10 p-12 text-center">
          <Logo variant="light" className="text-5xl justify-center mb-8" />
          <p className="text-brand-sage-light text-xl max-w-md mx-auto leading-relaxed">
            "The finest memories are made when gathered together."
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-brand-black">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-brand-gold hover:text-yellow-600 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

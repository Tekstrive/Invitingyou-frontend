import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-mirage border-t border-brand-sea/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-4 space-y-6">
            <Logo variant="light" />
            <p className="text-white/70 max-w-sm leading-relaxed">
              Elevate your celebrations with beautifully designed digital
              invitations. The premium way to gather.
            </p>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h3 className="font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4">
              {["About", "Carries", "Press"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-white/60 hover:text-brand-orange transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              {["Help Center", "Pricing", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-white/60 hover:text-brand-orange transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-white mb-6">Inspiration</h3>
            <ul className="space-y-4">
              {["Blog", "Wording Ideas", "Party Tips"].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-white/60 hover:text-brand-orange transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-brand-sea/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; {currentYear} InvitingYou. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

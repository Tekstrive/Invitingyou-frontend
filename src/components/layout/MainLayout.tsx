import type { ReactNode } from "react";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const MainLayout = ({
  children,
  showFooter = true,
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-sand font-sans selection:bg-brand-orange/20">
      {/* Navbar is handled globally in App.tsx */}
      <main className="flex-grow pt-20">
        {" "}
        {/* pt-20 to account for fixed navbar */}
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

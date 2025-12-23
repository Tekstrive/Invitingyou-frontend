import React from "react";
import { cn } from "../../lib/utils"; // Assuming you have a utils/cn helper, if not I'll create one or use inline clsx

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
}

export const Logo: React.FC<LogoProps> = ({ className, variant = "dark" }) => {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      {/* Optional: Add a simple geometric icon here if needed later */}
      <span
        className={`text-2xl font-bold tracking-tight ${
          variant === "light" ? "text-white" : "text-brand-mirage"
        }`}
      >
        Inviting
        <span
          className={
            variant === "light"
              ? "text-white italic"
              : "text-brand-orange italic"
          }
        >
          You
        </span>
      </span>
    </div>
  );
};

import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange disabled:pointer-events-none disabled:opacity-50",
          // Micro-interaction
          "active:scale-[0.98]",
          // Variants
          variant === "primary" &&
            "bg-brand-mirage text-white hover:bg-brand-mirage/90 shadow-sm",
          variant === "secondary" &&
            "bg-brand-orange text-white hover:bg-brand-orange/90 shadow-sm shadow-orange-200",
          variant === "outline" &&
            "border border-brand-mirage/20 bg-transparent shadow-sm hover:bg-brand-sand hover:text-brand-mirage",
          variant === "ghost" && "hover:bg-brand-sand hover:text-brand-mirage",
          variant === "link" &&
            "text-brand-mirage underline-offset-4 hover:underline",
          // Sizes
          size === "default" && "h-10 px-6 py-2",
          size === "sm" && "h-8 rounded-sm px-3 text-xs",
          size === "lg" && "h-12 rounded-sm px-8 text-lg",
          size === "icon" && "h-9 w-9",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

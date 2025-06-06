
import * as React from "react";
import { cn } from "@/lib/utils";

interface DarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: "none" | "glow" | "raise";
  variant?: "default" | "intense";
  gradient?: boolean;
  glow?: boolean;
}

const DarkCard = React.forwardRef<HTMLDivElement, DarkCardProps>(
  ({ className, hoverEffect = "none", variant = "default", gradient = false, glow = false, ...props }, ref) => {
    const hoverClasses = {
      none: "",
      glow: "hover:shadow-lg hover:shadow-purple-500/20",
      raise: "hover:transform hover:-translate-y-1 hover:shadow-xl",
    };

    const variantClasses = {
      default: "bg-slate-800/50",
      intense: "bg-slate-900/70",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "backdrop-blur-sm border border-slate-700 rounded-lg transition-all duration-300",
          variantClasses[variant],
          hoverClasses[hoverEffect],
          gradient && "bg-gradient-to-br from-slate-800/50 to-slate-900/50",
          glow && "shadow-lg shadow-purple-500/10",
          className
        )}
        {...props}
      />
    );
  }
);
DarkCard.displayName = "DarkCard";

export { DarkCard };

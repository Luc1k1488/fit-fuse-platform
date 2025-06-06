
import * as React from "react";
import { cn } from "@/lib/utils";

interface DarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: "none" | "glow" | "raise";
}

const DarkCard = React.forwardRef<HTMLDivElement, DarkCardProps>(
  ({ className, hoverEffect = "none", ...props }, ref) => {
    const hoverClasses = {
      none: "",
      glow: "hover:shadow-lg hover:shadow-purple-500/20",
      raise: "hover:transform hover:-translate-y-1 hover:shadow-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg transition-all duration-300",
          hoverClasses[hoverEffect],
          className
        )}
        {...props}
      />
    );
  }
);
DarkCard.displayName = "DarkCard";

export { DarkCard };

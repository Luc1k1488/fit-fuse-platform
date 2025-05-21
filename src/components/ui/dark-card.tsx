
import * as React from "react";
import { cn } from "@/lib/utils";

interface DarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  glow?: boolean;
  hoverEffect?: "raise" | "scale" | "border" | "none";
  variant?: "default" | "subtle" | "glass" | "intense";
}

const DarkCard = React.forwardRef<HTMLDivElement, DarkCardProps>(
  ({ className, gradient = false, glow = false, hoverEffect = "none", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300",
        variant === "default" && "border-gray-800 bg-gray-900",
        variant === "subtle" && "border-gray-800/50 bg-gray-900/90",
        variant === "glass" && "border-white/10 bg-black/40 backdrop-blur-xl",
        variant === "intense" && "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-950",
        gradient && !variant.includes("glass") && "bg-gradient-to-br from-gray-900 to-gray-800",
        glow && "shadow-primary/20",
        hoverEffect === "raise" && "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10",
        hoverEffect === "scale" && "hover:scale-[1.02] hover:shadow-xl",
        hoverEffect === "border" && "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
      {...props}
    />
  )
);
DarkCard.displayName = "DarkCard";

const DarkCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
DarkCardHeader.displayName = "DarkCardHeader";

const DarkCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
));
DarkCardTitle.displayName = "DarkCardTitle";

const DarkCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-400", className)}
    {...props}
  />
));
DarkCardDescription.displayName = "DarkCardDescription";

const DarkCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
DarkCardContent.displayName = "DarkCardContent";

const DarkCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
DarkCardFooter.displayName = "DarkCardFooter";

export { 
  DarkCard, 
  DarkCardHeader, 
  DarkCardFooter, 
  DarkCardTitle, 
  DarkCardDescription, 
  DarkCardContent 
};

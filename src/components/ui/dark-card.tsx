
import * as React from "react";
import { cn } from "@/lib/utils";

interface DarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const DarkCard = React.forwardRef<HTMLDivElement, DarkCardProps>(
  ({ className, gradient = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-800 shadow-lg",
        gradient ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gray-900",
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

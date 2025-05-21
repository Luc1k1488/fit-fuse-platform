
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gradientButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 active:scale-100",
        outline: "border-2 border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10 hover:scale-105 active:scale-100",
        secondary: "bg-gradient-to-r from-secondary to-primary/80 text-white shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:scale-105 active:scale-100",
        ghost: "text-primary bg-transparent hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
        dark: "bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-105 active:scale-100",
        glow: "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:scale-105 active:scale-100 after:content-[''] after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-violet-600 after:to-blue-500 after:blur-xl after:opacity-30 after:rounded-xl relative overflow-hidden",
        neon: "relative bg-black text-white border border-primary shadow-[0_0_10px_2px_rgba(139,92,246,0.6)] hover:shadow-[0_0_15px_3px_rgba(139,92,246,0.8)] hover:scale-105 active:scale-100 overflow-hidden z-0 after:absolute after:content-[''] after:z-[-1] after:w-16 after:h-16 after:blur-xl after:bg-primary after:-top-2 after:-left-2 after:opacity-70 hover:after:animate-pulse-light",
        glass: "backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-lg hover:bg-white/20 hover:scale-105 active:scale-100",
        destructive: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 hover:scale-105 active:scale-100",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton, gradientButtonVariants };

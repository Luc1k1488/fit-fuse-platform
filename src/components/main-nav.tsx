
import React from "react";
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
  children?: React.ReactNode;
}

export function MainNav({ className, children }: MainNavProps) {
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {children}
    </nav>
  );
}

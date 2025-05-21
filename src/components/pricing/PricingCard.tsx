
import React from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { DarkCard } from "@/components/ui/dark-card";

interface PricingFeature {
  text: string;
  highlighted?: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  popular?: boolean;
  onClick: () => void;
  buttonText: string;
  badge?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  popular = false,
  onClick,
  buttonText,
  badge,
}) => {
  return (
    <DarkCard 
      className={`overflow-hidden transition-all duration-300 ${popular ? "" : ""}`}
      gradient={popular}
      glow={popular}
      hoverEffect="raise"
      variant={popular ? "intense" : "default"}
    >
      {popular && (
        <div className="py-1.5 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-center text-sm font-medium">
          {badge || "Самый популярный"}
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold purple-blue-gradient-text">{price}</span>
          <span className="ml-1 text-gray-400">/ {period}</span>
        </div>
        
        <p className="mt-4 text-gray-400 min-h-[48px]">{description}</p>
        
        <div className="mt-6">
          <GradientButton
            onClick={onClick}
            className="w-full"
            variant={popular ? "glow" : "default"}
            size="lg"
          >
            {buttonText}
          </GradientButton>
        </div>
        
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.highlighted ? (
                <ShieldCheck className="h-5 w-5 flex-shrink-0 text-primary animate-pulse-light" />
              ) : (
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
              )}
              <span className={`ml-3 ${feature.highlighted ? "text-white font-medium" : "text-gray-300"}`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DarkCard>
  );
};

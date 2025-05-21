
import React from "react";
import { CheckCircle } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface PricingFeature {
  text: string;
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
}) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-5px] ${
        popular
          ? "border-2 border-primary shadow-xl shadow-primary/20"
          : "border border-gray-800 hover:border-gray-700"
      }`}
    >
      {popular && (
        <div className="py-1.5 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-center text-sm font-medium">
          Самый популярный
        </div>
      )}
      
      <div className={`p-6 bg-gray-900 ${popular ? "bg-gray-900/80" : ""}`}>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-extrabold text-white">{price}</span>
          <span className="ml-1 text-gray-400">/ {period}</span>
        </div>
        
        <p className="mt-4 text-gray-400">{description}</p>
        
        <div className="mt-6">
          <GradientButton
            onClick={onClick}
            className="w-full"
            variant={popular ? "default" : "secondary"}
          >
            {buttonText}
          </GradientButton>
        </div>
        
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
              <span className="ml-3 text-gray-300">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

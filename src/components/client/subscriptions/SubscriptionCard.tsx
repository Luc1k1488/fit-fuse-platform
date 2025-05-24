
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Gift } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  image: string;
  description: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
  bonus?: string;
  dailyCost?: string;
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onClick: (plan: SubscriptionPlan) => void;
}

export const SubscriptionCard = ({ plan, onClick }: SubscriptionCardProps) => {
  return (
    <Card className={`relative overflow-hidden bg-white border-2 transition-all ${
      plan.current ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {plan.popular && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            Популярный
          </Badge>
        </div>
      )}

      {plan.bonus && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Gift className="h-3 w-3 mr-1" />
            {plan.bonus}
          </Badge>
        </div>
      )}
      
      <div className="h-40 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600">
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{plan.price}</div>
            <div className="text-lg opacity-90">{plan.period}</div>
            {plan.dailyCost && (
              <div className="text-sm opacity-75 mt-1">{plan.dailyCost}</div>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
        </div>

        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-600 mr-2 shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => onClick(plan)}
          className={`w-full ${
            plan.current 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90'
          }`}
          disabled={plan.current}
        >
          {plan.current ? 'Текущий план' : 'Выбрать план'}
        </Button>
      </CardContent>
    </Card>
  );
};

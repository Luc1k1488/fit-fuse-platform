
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

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
      
      <div className="h-40 overflow-hidden">
        <img 
          src={plan.image} 
          alt={plan.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
            <span className="text-gray-500 ml-1">/{plan.period}</span>
          </div>
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


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
    <Card className={`relative overflow-hidden bg-slate-800/50 backdrop-blur-sm border-2 transition-all ${
      plan.current ? 'border-purple-500' : 'border-slate-700 hover:border-slate-600'
    }`}>
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <Star className="h-3 w-3 mr-1" />
            Популярный
          </Badge>
        </div>
      )}

      {plan.bonus && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Gift className="h-3 w-3 mr-1" />
            {plan.bonus}
          </Badge>
        </div>
      )}
      
      <div className="h-40 overflow-hidden relative">
        <img 
          src={plan.image} 
          alt={plan.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="text-2xl font-bold">{plan.price}</div>
          <div className="text-sm opacity-90">{plan.period}</div>
          {plan.dailyCost && (
            <div className="text-xs opacity-75">{plan.dailyCost}</div>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-slate-300 text-sm mb-3">{plan.description}</p>
        </div>

        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-400 mr-2 shrink-0" />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => onClick(plan)}
          className={`w-full ${
            plan.current 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white'
          }`}
          disabled={plan.current}
        >
          {plan.current ? 'Текущий план' : 'Выбрать план'}
        </Button>
      </CardContent>
    </Card>
  );
};

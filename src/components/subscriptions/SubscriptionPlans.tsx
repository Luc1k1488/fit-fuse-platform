
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
}

interface SubscriptionPlansProps {
  onPlanSelect: (plan: SubscriptionPlan) => void;
  currentPlanId?: string;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onPlanSelect,
  currentPlanId
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Ошибка загрузки тарифных планов');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (index: number) => {
    if (index === 0) return <Check className="h-6 w-6" />;
    if (index === 1) return <Star className="h-6 w-6" />;
    return <Zap className="h-6 w-6" />;
  };

  const getPlanColor = (index: number) => {
    if (index === 0) return "border-gray-200";
    if (index === 1) return "border-purple-500 ring-2 ring-purple-200";
    return "border-amber-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`relative ${getPlanColor(index)} transition-all duration-200 hover:shadow-lg`}
        >
          {index === 1 && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-600 text-white">Популярный</Badge>
            </div>
          )}
          
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${
                index === 0 ? 'bg-gray-100' : 
                index === 1 ? 'bg-purple-100' : 'bg-amber-100'
              }`}>
                {getPlanIcon(index)}
              </div>
            </div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="text-3xl font-bold mt-2">
              {plan.price.toLocaleString()} ₽
            </div>
            <p className="text-sm text-gray-600">
              на {plan.duration_days} дней
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center text-sm">
              {plan.description}
            </p>
            
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => onPlanSelect(plan)}
              disabled={currentPlanId === plan.id}
              className={`w-full mt-6 ${
                index === 1 ? 'bg-purple-600 hover:bg-purple-700' : ''
              }`}
            >
              {currentPlanId === plan.id ? 'Текущий план' : 'Выбрать план'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

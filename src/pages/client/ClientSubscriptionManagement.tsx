
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SubscriptionPlans } from "@/components/subscriptions/SubscriptionPlans";
import { PaymentForm } from "@/components/subscriptions/PaymentForm";
import { SubscriptionStatus } from "@/components/subscriptions/SubscriptionStatus";

type ViewState = 'status' | 'plans' | 'payment';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
}

const ClientSubscriptionManagement = () => {
  const [currentView, setCurrentView] = useState<ViewState>('status');
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Ошибка загрузки подписки');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setCurrentView('payment');
  };

  const handlePaymentSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedPlan) return;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + selectedPlan.duration_days);

      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: selectedPlan.id,
          plan_name: selectedPlan.name,
          price: selectedPlan.price,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active'
        });

      if (error) throw error;

      toast.success('Подписка успешно активирована!');
      await fetchCurrentSubscription();
      setCurrentView('status');
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Ошибка создания подписки');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'status':
        return (
          <SubscriptionStatus
            subscription={currentSubscription}
            onUpgrade={() => setCurrentView('plans')}
            onRenew={() => setCurrentView('plans')}
          />
        );
      
      case 'plans':
        return (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setCurrentView('status')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">Выберите тарифный план</h2>
            </div>
            <SubscriptionPlans
              onPlanSelect={handlePlanSelect}
              currentPlanId={currentSubscription?.plan_id}
            />
          </div>
        );
      
      case 'payment':
        return selectedPlan ? (
          <PaymentForm
            planName={selectedPlan.name}
            planPrice={selectedPlan.price}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentView('plans')}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Управление подпиской</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white">Управление подпиской</h1>
        <p className="text-slate-300">Управляйте вашей подпиской и тарифными планами</p>
      </div>

      <div className="px-4 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ClientSubscriptionManagement;


import { Calendar, CheckCircle } from "lucide-react";

interface ActiveSubscription {
  id: string;
  name: string;
  type: string;
  image: string;
  status: string;
  expiryDate: string;
  remainingVisits?: number;
}

interface ActiveSubscriptionCardProps {
  subscription: ActiveSubscription;
}

export const ActiveSubscriptionCard = ({ subscription }: ActiveSubscriptionCardProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium text-green-400">{subscription.status}</span>
        </div>
        <div className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full text-xs">
          {subscription.name}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">{subscription.type}</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <Calendar className="h-4 w-4" />
          <span>до {subscription.expiryDate}</span>
        </div>
        
        {subscription.remainingVisits && (
          <span className="text-white font-medium">
            {subscription.remainingVisits} посещений
          </span>
        )}
      </div>
    </div>
  );
};

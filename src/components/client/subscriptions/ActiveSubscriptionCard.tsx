
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActiveSubscriptionCardProps {
  subscription: {
    id: string;
    name: string;
    type: string;
    image: string;
    status: string;
    expiryDate: string;
    remainingVisits?: number;
  };
}

export const ActiveSubscriptionCard = ({ subscription }: ActiveSubscriptionCardProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{subscription.name}</h3>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {subscription.status}
              </Badge>
            </div>
            <p className="text-white/90 text-sm mb-1">{subscription.type}</p>
            <p className="text-white/80 text-xs">
              Действует до: {subscription.expiryDate}
            </p>
            {subscription.remainingVisits && (
              <p className="text-white/80 text-xs">
                Осталось посещений: {subscription.remainingVisits}
              </p>
            )}
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center ml-4">
            <img 
              src={subscription.image} 
              alt={subscription.name}
              className="w-12 h-12 object-cover rounded"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

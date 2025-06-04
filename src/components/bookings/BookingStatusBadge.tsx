
import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: string;
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'booked':
        return { label: 'Забронировано', variant: 'default' as const };
      case 'completed':
        return { label: 'Завершено', variant: 'secondary' as const };
      case 'cancelled':
        return { label: 'Отменено', variant: 'destructive' as const };
      case 'confirmed':
        return { label: 'Подтверждено', variant: 'default' as const };
      default:
        return { label: status, variant: 'secondary' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

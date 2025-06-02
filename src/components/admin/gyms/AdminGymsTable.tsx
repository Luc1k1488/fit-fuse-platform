
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Star, Users } from "lucide-react";
import { Gym, Partner } from "@/types";

interface AdminGymsTableProps {
  gyms: Gym[];
  partners: Partner[];
  onEditGym: (gym: Gym) => void;
}

export const AdminGymsTable = ({ gyms, partners, onEditGym }: AdminGymsTableProps) => {
  const getPartnerName = (partnerId: string | null) => {
    if (!partnerId || partnerId === 'unassigned') return 'Не назначен';
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.name : 'Неизвестный партнер';
  };

  const formatRating = (rating: number | null) => {
    if (!rating) return '-';
    return rating.toFixed(1);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Локация</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Партнер</TableHead>
          <TableHead>Рейтинг</TableHead>
          <TableHead>Отзывы</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gyms.map((gym) => (
          <TableRow key={gym.id}>
            <TableCell>
              <div>
                <div className="font-medium">{gym.name}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {gym.address}
                </div>
              </div>
            </TableCell>
            <TableCell>{gym.city}</TableCell>
            <TableCell>
              {gym.category && (
                <Badge variant="outline">{gym.category}</Badge>
              )}
            </TableCell>
            <TableCell>{getPartnerName(gym.partner_id)}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {formatRating(gym.rating)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-1" />
                {gym.review_count || 0}
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditGym(gym)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Редактировать
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


import { useState } from "react";
import { 
  Edit,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-shrink-0 self-center sm:self-start">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg bg-slate-700 text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                Премиум
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Mail className="h-3 w-3 text-blue-400 flex-shrink-0" />
                <span className="break-all">{user.email}</span>
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Phone className="h-3 w-3 text-green-400 flex-shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <MapPin className="h-3 w-3 text-purple-400 flex-shrink-0" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-1 justify-center sm:justify-start">
                <Calendar className="h-3 w-3 text-orange-400 flex-shrink-0" />
                <span>С нами с {user.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;


import { Camera, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileUser {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  avatar: string;
}

interface ProfileHeaderProps {
  user: ProfileUser;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 p-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1 text-gray-400">
            <p>{user.email}</p>
            <p>{user.phone}</p>
            <p className="flex items-center gap-1 justify-center sm:justify-start">
              📍 {user.location}
            </p>
            <p className="text-sm">С нами с {user.joinDate} года</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

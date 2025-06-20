
import { useState } from "react";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarUpload from "./AvatarUpload";
import EditProfileDialog from "./EditProfileDialog";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setCurrentAvatar(newAvatarUrl);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <AvatarUpload 
          currentAvatar={currentAvatar}
          onAvatarUpdate={handleAvatarUpdate}
        />

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white p-1"
              onClick={() => setIsEditDialogOpen(true)}
            >
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

      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default ProfileHeader;

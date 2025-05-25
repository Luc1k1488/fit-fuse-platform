import { useState } from "react";
import ProfileHeader from "@/components/client/profile/ProfileHeader";
import StatsCard from "@/components/client/profile/StatsCard";
import SettingsMenu from "@/components/client/profile/SettingsMenu";

const ClientProfile = () => {
  const [user] = useState({
    name: "Анна Петрова",
    email: "anna.petrova@email.com",
    phone: "+7 (999) 123-45-67",
    location: "Махачкала",
    joinDate: "Январь 2024",
    avatar: "/placeholder.svg"
  });

  const [stats] = useState({
    totalWorkouts: 45,
    currentStreak: 7,
    favoriteGyms: 12,
    monthlyGoal: 20
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Заголовок */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-4 py-6">
        <h1 className="text-2xl font-bold text-white animate-fade-in">Профиль</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        <ProfileHeader user={user} />
        <StatsCard stats={stats} />
        <SettingsMenu />
      </div>
    </div>
  );
};

export default ClientProfile;

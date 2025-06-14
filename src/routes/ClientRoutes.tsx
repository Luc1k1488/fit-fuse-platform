
import { Route } from "react-router-dom";
import ClientProtectedRoute from "@/components/auth/ClientProtectedRoute";
import ClientLayout from "@/layouts/ClientLayout";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientHome from "@/pages/client/ClientHome";
import ClientGyms from "@/pages/client/ClientGyms";
import ClientGymDetail from "@/pages/client/ClientGymDetail";
import ClientClasses from "@/pages/client/ClientClasses";
import ClientBookings from "@/pages/client/ClientBookings";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientProfileNew from "@/pages/client/ClientProfileNew";
import ClientCalendar from "@/pages/client/ClientCalendar";
import ClientProgress from "@/pages/client/ClientProgress";
import ClientSchedule from "@/pages/client/ClientSchedule";
import ClientSearch from "@/pages/client/ClientSearch";
import ClientSubscription from "@/pages/client/ClientSubscription";
import ClientSubscriptionNew from "@/pages/client/ClientSubscriptionNew";
import ClientSubscriptionManagement from "@/pages/client/ClientSubscriptionManagement";
import ClientSupport from "@/pages/client/ClientSupport";

export const ClientRoutes = () => (
  <Route path="/app/*" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <Route index element={<ClientDashboard />} />
        <Route path="home" element={<ClientHome />} />
        <Route path="gyms" element={<ClientGyms />} />
        <Route path="gyms/:id" element={<ClientGymDetail />} />
        <Route path="classes" element={<ClientClasses />} />
        <Route path="bookings" element={<ClientBookings />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="profile-new" element={<ClientProfileNew />} />
        <Route path="calendar" element={<ClientCalendar />} />
        <Route path="progress" element={<ClientProgress />} />
        <Route path="schedule" element={<ClientSchedule />} />
        <Route path="search" element={<ClientSearch />} />
        <Route path="subscription" element={<ClientSubscription />} />
        <Route path="subscription-new" element={<ClientSubscriptionNew />} />
        <Route path="subscription-management" element={<ClientSubscriptionManagement />} />
        <Route path="support" element={<ClientSupport />} />
      </ClientLayout>
    </ClientProtectedRoute>
  } />
);

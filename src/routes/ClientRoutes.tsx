
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

export const clientRoutes = [
  <Route key="app-dashboard" path="/app" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientDashboard />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-home" path="/app/home" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientHome />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-gyms" path="/app/gyms" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientGyms />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-gym-detail" path="/app/gyms/:id" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientGymDetail />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-classes" path="/app/classes" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientClasses />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-bookings" path="/app/bookings" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientBookings />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-profile" path="/app/profile" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientProfile />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-profile-new" path="/app/profile-new" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientProfileNew />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-calendar" path="/app/calendar" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientCalendar />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-progress" path="/app/progress" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientProgress />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-schedule" path="/app/schedule" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientSchedule />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-search" path="/app/search" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientSearch />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-subscription" path="/app/subscription" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientSubscription />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-subscription-new" path="/app/subscription-new" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientSubscriptionNew />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-subscription-management" path="/app/subscription-management" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientSubscriptionManagement />
      </ClientLayout>
    </ClientProtectedRoute>
  } />,
  <Route key="app-support" path="/app/support" element={
    <ClientProtectedRoute>
      <ClientLayout>
        <ClientSupport />
      </ClientLayout>
    </ClientProtectedRoute>
  } />
];

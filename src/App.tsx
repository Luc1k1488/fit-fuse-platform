
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth_context";

// Route components
import { PublicRoutes } from "@/routes/PublicRoutes";
import { AuthRoutes } from "@/routes/AuthRoutes";
import { ClientRoutes } from "@/routes/ClientRoutes";
import { AdminRoutes } from "@/routes/AdminRoutes";
import { PartnerRoutes } from "@/routes/PartnerRoutes";
import { SupportRoutes } from "@/routes/SupportRoutes";

// Other components
import NotFound from "@/pages/NotFound";

// Configuration
import { queryClient } from "@/config/queryClient";

import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <PublicRoutes />

            {/* Auth routes */}
            <AuthRoutes />

            {/* Client routes */}
            <ClientRoutes />

            {/* Admin routes */}
            <AdminRoutes />

            {/* Partner routes */}
            <PartnerRoutes />

            {/* Support routes */}
            <SupportRoutes />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

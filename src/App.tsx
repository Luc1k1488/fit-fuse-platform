import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth_context";

// Route arrays
import { publicRoutes } from "@/routes/PublicRoutes";
import { authRoutes } from "@/routes/AuthRoutes";
import { clientRoutes } from "@/routes/ClientRoutes";
import { adminRoutes } from "@/routes/AdminRoutes";
import { partnerRoutes } from "@/routes/PartnerRoutes";
import { supportRoutes } from "@/routes/SupportRoutes";

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
            {publicRoutes}

            {/* Auth routes */}
            {authRoutes}

            {/* Client routes */}
            {clientRoutes}

            {/* Admin routes */}
            {adminRoutes}

            {/* Partner routes */}
            {partnerRoutes}

            {/* Support routes */}
            {supportRoutes}

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

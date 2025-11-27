import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PageLoader from "./components/PageLoader";
import { Building2, FileText, Calendar, BarChart3, Settings as SettingsIcon, Award } from "lucide-react";
import Layout from "./components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Households from "./pages/Households";
import Officials from "./pages/Officials";
import Ordinances from "./pages/Ordinances";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Certificates from "./pages/Certificates";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <PageLoader />}
      {children}
    </>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LoadingWrapper>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/residents" element={<ProtectedRoute><Layout><Residents /></Layout></ProtectedRoute>} />
                <Route path="/households" element={<ProtectedRoute><Layout><Households /></Layout></ProtectedRoute>} />
                <Route path="/officials" element={<ProtectedRoute><Layout><Officials /></Layout></ProtectedRoute>} />
                <Route path="/ordinances" element={<ProtectedRoute><Layout><Ordinances /></Layout></ProtectedRoute>} />
                <Route path="/activities" element={<ProtectedRoute><Layout><Activities /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                <Route path="/certificates" element={<ProtectedRoute><Layout><Certificates /></Layout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LoadingWrapper>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

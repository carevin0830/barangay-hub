import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Building2, FileText, Calendar, BarChart3, Settings as SettingsIcon, Award } from "lucide-react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Households from "./pages/Households";
import Officials from "./pages/Officials";
import Ordinances from "./pages/Ordinances";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Certificates from "./pages/Certificates";
import Settings from "./pages/Settings";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/residents" element={<Residents />} />
            <Route path="/households" element={<Households />} />
            <Route path="/officials" element={<Officials />} />
            <Route path="/ordinances" element={<Ordinances />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

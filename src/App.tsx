import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Building2, FileText, Calendar, BarChart3, Settings, Award, FolderOpen } from "lucide-react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Households from "./pages/Households";
import Officials from "./pages/Officials";
import Ordinances from "./pages/Ordinances";
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
            <Route 
              path="/activities" 
              element={
                <Placeholder 
                  title="Activities & Programs" 
                  description="Post events, track attendance, and manage budgets. Coming soon."
                  icon={Calendar}
                />
              } 
            />
            <Route 
              path="/reports" 
              element={
                <Placeholder 
                  title="Reports Management" 
                  description="Submit concerns, track tickets, and generate reports. Coming soon."
                  icon={BarChart3}
                />
              } 
            />
            <Route 
              path="/certificates" 
              element={
                <Placeholder 
                  title="Certificates Management" 
                  description="Generate and manage barangay certificates. Coming soon."
                  icon={Award}
                />
              } 
            />
            <Route 
              path="/documents" 
              element={
                <Placeholder 
                  title="Documents Management" 
                  description="Manage barangay documents and files. Coming soon."
                  icon={FolderOpen}
                />
              } 
            />
            <Route 
              path="/settings" 
              element={
                <Placeholder 
                  title="System Settings" 
                  description="Customize barangay info, manage users, and configure system. Coming soon."
                  icon={Settings}
                />
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

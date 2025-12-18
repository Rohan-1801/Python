import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LeadProvider } from "@/contexts/LeadContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PropertyProvider } from "@/contexts/PropertyContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LeadList from "./pages/LeadList";
import LeadForm from "./pages/LeadForm";
import LeadDetail from "./pages/LeadDetail";
import PropertyList from "./pages/PropertyList";
import PropertyForm from "./pages/PropertyForm";
import PropertyDetail from "./pages/PropertyDetail";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <LeadProvider>
          <PropertyProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<LeadList />} />
                    <Route path="/leads/create" element={<LeadForm />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                    <Route path="/leads/:id/edit" element={<LeadForm />} />
                    <Route path="/properties" element={<PropertyList />} />
                    <Route path="/properties/create" element={<PropertyForm />} />
                    <Route path="/properties/:id" element={<PropertyDetail />} />
                    <Route path="/properties/:id/edit" element={<PropertyForm />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/payment" element={<Payment />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </PropertyProvider>
        </LeadProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

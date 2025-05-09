
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Restaurant1 from "./pages/Restaurant1";
import Restaurant2 from "./pages/Restaurant2";
import UniversalPage from "./pages/UniversalPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import { DeviceIdProvider } from "./context/DeviceIdContext";
import { OrderSystemProvider } from "./context/orderSystem";
import AnalyticsPage from "./pages/AnalyticsPage";
import MenuManagementPage from "./pages/MenuManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DeviceIdProvider>
      <OrderSystemProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UniversalPage />} />
              <Route path="/restaurant/1" element={<Restaurant1 />} />
              <Route path="/restaurant/2" element={<Restaurant2 />} />
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/analytics" element={<AnalyticsPage />} />
              <Route path="/manager/menu" element={<MenuManagementPage />} />
              <Route path="/chef" element={<ChefDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OrderSystemProvider>
    </DeviceIdProvider>
  </QueryClientProvider>
);

export default App;

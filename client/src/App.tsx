import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { SearchProvider } from "@/components/SearchContext";
import OAuthSuccess from "./pages/OAuthSuccess";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import SellerDashboard from "./pages/SellerDashboard";
import Orders from "./pages/Orders";
import Notifications from "./pages/Notifications";
import PaymentMethods from "./pages/PaymentMethods";
import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import CreatorProfile from "./pages/CreatorProfile";
import ProtectedRoute from "./pages/ProtectedRoutes";
import SellerVerify from "./pages/SellerVerify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SearchProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/artisans/:artisanId" element={<CreatorProfile />} />
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
             <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/seller/verify" element={<SellerVerify />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </SearchProvider>
  </QueryClientProvider>
);

export default App;
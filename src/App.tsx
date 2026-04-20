import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Menu from "./pages/Menu.tsx";
import Auth from "./pages/Auth.tsx";
import Checkout from "./pages/Checkout.tsx";
import Order from "./pages/Order.tsx";
import Profile from "./pages/Profile.tsx";
import Seller from "./pages/Seller.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import { RoleGuard } from "./components/RoleGuard.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route
            path="/profile"
            element={
              <RoleGuard allow={["customer", "admin"]}>
                <Profile />
              </RoleGuard>
            }
          />
          <Route
            path="/seller"
            element={
              <RoleGuard allow={["seller", "admin"]}>
                <Seller />
              </RoleGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGuard allow={["admin"]}>
                <Admin />
              </RoleGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

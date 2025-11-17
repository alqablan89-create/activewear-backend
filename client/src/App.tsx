import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/lib/cart-context";
import { ProtectedRoute } from "@/lib/protected-route";
import '@/lib/i18n';

import HomePage from "@/pages/home-page";
import ShopPage from "@/pages/shop-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminProducts from "@/pages/admin-products";
import AdminOrders from "@/pages/admin-orders";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/categories" component={ShopPage} />
      <Route path="/offers" component={ShopPage} />
      <Route path="/about" component={() => <div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">About Lift Me Up</h1></div>} />
      <Route path="/contact" component={() => <div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Contact Us</h1></div>} />
      <Route path="/shipping" component={() => <div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Return & Shipping Policy</h1></div>} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/categories" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Categories Management</h1></div>} />
      <ProtectedRoute path="/admin/orders" component={AdminOrders} />
      <ProtectedRoute path="/admin/users" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Users Management</h1></div>} />
      <ProtectedRoute path="/admin/discounts" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Discounts Management</h1></div>} />
      <ProtectedRoute path="/admin/settings" component={() => <div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

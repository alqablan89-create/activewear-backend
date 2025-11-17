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
import CheckoutPage from "@/pages/checkout";
import PaymentSuccessPage from "@/pages/payment-success";
import PaymentFailurePage from "@/pages/payment-failure";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminProducts from "@/pages/admin-products";
import AdminCategories from "@/pages/admin-categories";
import AdminOrders from "@/pages/admin-orders";
import AdminUsers from "@/pages/admin-users";
import AdminDiscounts from "@/pages/admin-discounts";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import GiftCardPage from "@/pages/gift-card-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import CookiePage from "@/pages/cookie-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/payment/success" component={PaymentSuccessPage} />
      <Route path="/payment/failure" component={PaymentFailurePage} />
      <Route path="/categories" component={ShopPage} />
      <Route path="/offers" component={ShopPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/gift-card" component={GiftCardPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/cookie-policy" component={CookiePage} />
      <Route path="/shipping" component={() => <div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl font-bold">Return & Shipping Policy</h1></div>} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/categories" component={AdminCategories} />
      <ProtectedRoute path="/admin/orders" component={AdminOrders} />
      <ProtectedRoute path="/admin/users" component={AdminUsers} />
      <ProtectedRoute path="/admin/discounts" component={AdminDiscounts} />
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

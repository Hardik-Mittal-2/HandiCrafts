import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./lib/context";
import { ThemeProvider } from "./lib/theme-context";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { NewHomepage } from "./components/NewHomepage";
import { LandingPage } from "./components/LandingPage";
import { BuyerDashboard } from "./components/BuyerDashboard";
import { SellerDashboard } from "./components/SellerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { ConsultantDashboard } from "./components/ConsultantDashboard";
import { CartSheet } from "./components/CartSheet";
import { CheckoutDialog } from "./components/CheckoutDialog";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { Home } from "./pages/Home";
import { Login as LoginPage } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Products } from "./pages/Products";
import { Exhibitions } from "./pages/Exhibitions";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { SupportTicket } from "./pages/SupportTicket";

function AppContent() {
  const { user: authUser } = useAuth();
  const { setUser } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Sync AuthContext user with AppContext user
  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role as 'admin' | 'seller' | 'buyer' | 'consultant' | null,
        blocked: authUser.isBlocked,
      });
    } else {
      setUser(null);
    }
  }, [authUser, setUser]);

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    toast.success("Order placed successfully! 🎉", {
      description: "You will receive a confirmation email shortly.",
    });
  };

  const renderDashboard = () => {
    if (!authUser) return <Navigate to="/login" replace />;

    switch (authUser.role) {
      case "admin":
        return <AdminDashboard />;
      case "seller":
        return <SellerDashboard />;
      case "consultant":
        return <ConsultantDashboard />;
      case "buyer":
        return <BuyerDashboard />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-ivory dark:bg-dark-bg">
      <Router>
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<NewHomepage />} />
            <Route
              path="/login"
              element={authUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route
              path="/signup"
              element={authUser ? <Navigate to="/dashboard" replace /> : <Signup />}
            />

            <Route path="/products" element={<Products />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<SupportTicket />} />

            <Route
              path="/dashboard"
              element={authUser ? renderDashboard() : <Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Cart and Checkout - Buyers and consultants */}
          {(authUser?.role === "buyer" || authUser?.role === "consultant") && (
            <>
              <CartSheet
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              />
              <CheckoutDialog
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                onSuccess={handleCheckoutSuccess}
              />
            </>
          )}
        </main>
        <Footer />
      </Router>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import DeliveryInfoModal from "./components/DeliveryInfoModal";
import ZonesModal from "./components/ZonesModal";
import HistoryPanel from "./components/HistoryPanel";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </CartProvider>
  );
}

function Layout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);
  const nav = useNavigate(); // ✅ внутри Router — работает гарантированно

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-stone-100">
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenInfo={() => setInfoOpen(true)}
        onOpenZones={() => setZonesOpen(true)}
      />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/history" element={<HistoryPanel />} />
        </Routes>
      </div>
      <Footer />

      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); nav("/checkout"); }}
        />
      )}
      {infoOpen && <DeliveryInfoModal onClose={() => setInfoOpen(false)} onZones={() => { setInfoOpen(false); setZonesOpen(true); }} />}
      {zonesOpen && <ZonesModal onClose={() => setZonesOpen(false)} />}
    </div>
  );
}
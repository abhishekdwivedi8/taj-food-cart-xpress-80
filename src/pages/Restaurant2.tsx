
import React, { useEffect } from "react";
import { useDeviceId } from "@/context/DeviceIdContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import OrderHistory from "@/components/OrderHistory";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import OrderConfirmation from "@/components/OrderConfirmation";
import OrderSuccess from "@/components/OrderSuccess";
import PaymentModal from "@/components/PaymentModal";
import { ensureOrderHistoryPersistence } from "@/utils/orderStorageUtils";

const Restaurant2: React.FC = () => {
  const { deviceId } = useDeviceId();
  const restaurantId = 2;

  // When page loads, scroll to top and ensure order history persistence
  useEffect(() => {
    window.scrollTo(0, 0);
    // Ensure order history is properly initialized
    ensureOrderHistoryPersistence();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header restaurantId={restaurantId} />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <OrderHistory />
          <MenuSection restaurantId={restaurantId} />
        </div>
      </main>
      <Footer restaurantId={restaurantId} />
      
      {/* Overlays */}
      <Cart restaurantId={restaurantId} />
      <OrderConfirmation restaurantId={restaurantId} />
      <OrderSuccess restaurantId={restaurantId} />
      <PaymentModal restaurantId={restaurantId} />
      
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs opacity-50">
        Device ID: {deviceId.substring(0, 8)}...
      </div>
    </div>
  );
};

export default Restaurant2;

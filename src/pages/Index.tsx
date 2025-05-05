
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import OrderHistory from "@/components/OrderHistory";
import Cart from "@/components/Cart";
import OrderConfirmation from "@/components/OrderConfirmation";
import OrderSuccess from "@/components/OrderSuccess";
import PaymentModal from "@/components/PaymentModal";
import Footer from "@/components/Footer";
import { FoodCartProvider } from "@/context/FoodCartContext";

const Index: React.FC = () => {
  const restaurantId = 0; // Using 0 for the index page
  
  // When page loads, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <FoodCartProvider>
      <div className="min-h-screen flex flex-col">
        <Header restaurantId={restaurantId} />
        <main className="flex-grow">
          <Hero />
          <div className="container mx-auto px-4 py-8">
            <OrderHistory />
            <MenuSection restaurantId={restaurantId} />
          </div>
        </main>
        <Footer />
        
        {/* Overlays */}
        <Cart restaurantId={restaurantId} />
        <OrderConfirmation restaurantId={restaurantId} />
        <OrderSuccess restaurantId={restaurantId} />
        <PaymentModal restaurantId={restaurantId} />
      </div>
    </FoodCartProvider>
  );
};

export default Index;


import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useDeviceId } from "@/context/DeviceIdContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";

const UniversalPage: React.FC = () => {
  const { deviceId } = useDeviceId();

  // When page loads, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header restaurantId={0} />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-6 text-restaurant-primary font-serif">
              Welcome to <span className="text-restaurant-secondary">The Taj Flavours</span>
            </h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-700">
              Experience the rich heritage of Indian cuisine with our carefully crafted menu. 
              Each dish tells a story of tradition, flavor, and culinary excellence. 
              Browse our menu below or choose your table to start ordering.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link 
                to="/restaurant/1"
                className="block p-8 bg-restaurant-primary text-white rounded-lg shadow-lg transform transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-serif mb-3">Table 1</h3>
                <p className="mb-4">Start ordering your favorite dishes</p>
                <div className="mt-2 bg-white text-restaurant-primary font-semibold py-2 px-4 rounded inline-block">
                  Order Now
                </div>
              </Link>
              
              <Link 
                to="/restaurant/2"
                className="block p-8 bg-restaurant-secondary text-restaurant-dark rounded-lg shadow-lg transform transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-serif mb-3">Table 2</h3>
                <p className="mb-4">Start ordering your favorite dishes</p>
                <div className="mt-2 bg-white text-restaurant-primary font-semibold py-2 px-4 rounded inline-block">
                  Order Now
                </div>
              </Link>
            </div>
          </section>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow mb-12">
            <h3 className="text-2xl font-bold text-restaurant-primary mb-4 font-serif">Restaurant Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg mb-2">Authentic Cuisine</h4>
                <p className="text-gray-600">Experience the true flavors of India with our authentic recipes passed down through generations</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg mb-2">Private Dining</h4>
                <p className="text-gray-600">Elegant private dining spaces available for special occasions and business meetings</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-lg mb-2">Catering Services</h4>
                <p className="text-gray-600">Let us cater your next event with our delicious menu options and professional service</p>
              </div>
            </div>
          </div>
          
          <MenuSection restaurantId={0} />
        </div>
      </main>
      <Footer showMarquee={true} />
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/911234567890?text=I'd%20like%20to%20place%20an%20order%20from%20Taj%20Flavours" 
        className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-40 transition-transform hover:scale-110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={32} />
      </a>
      
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs opacity-50">
        Universal Page • Device ID: {deviceId.substring(0, 8)}...
      </div>
    </div>
  );
};

export default UniversalPage;

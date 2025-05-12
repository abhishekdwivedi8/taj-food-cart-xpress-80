
import React from "react";
import { ShoppingCart, ConciergeBell } from "lucide-react";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  restaurantId: number;
}

const Header: React.FC<HeaderProps> = ({ restaurantId }) => {
  const { getCartCount, setIsCartOpen } = useOrderSystem();
  const cartCount = getCartCount(restaurantId);

  return (
    <header className="relative py-4 px-6 flex items-center justify-between bg-[#F5F5DC] shadow-md z-10">
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center justify-center bg-[#5B0018] p-2 rounded-full h-14 w-14 border-2 border-[#D4AF37] shadow-md">
          <ConciergeBell size={28} className="text-[#D4AF37]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#5B0018] font-serif tracking-wider">
            The Taj <span className="text-[#D4AF37]">Flavours</span>
          </h1>
          <p className="text-xs md:text-sm text-[#5B0018]/80 font-serif italic">
            Exquisite Dining Experience - Table {restaurantId}
          </p>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="flex items-center gap-2 transition-all border-[#D4AF37] bg-white hover:bg-[#F5F5DC] shadow-sm"
        onClick={() => setIsCartOpen(restaurantId, true)}
      >
        <ShoppingCart size={18} className="text-[#5B0018]" />
        <span className="hidden md:inline text-[#5B0018] font-medium">Cart</span>
        {cartCount > 0 && (
          <span className="flex items-center justify-center bg-[#5B0018] text-white text-xs font-bold rounded-full h-5 w-5 ml-1 shadow-sm">
            {cartCount}
          </span>
        )}
      </Button>
    </header>
  );
};

export default Header;

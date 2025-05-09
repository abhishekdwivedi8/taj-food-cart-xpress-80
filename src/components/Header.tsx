
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
    <header className="relative py-4 px-6 flex items-center justify-between bg-custom-lightYellow border-b border-custom-yellow/30 z-10">
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center justify-center bg-custom-red p-2 rounded-full h-14 w-14">
          <ConciergeBell size={28} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-custom-red font-serif tracking-wider">
            The Taj <span className="text-custom-green">Flavours</span>
          </h1>
          <p className="text-xs md:text-sm text-custom-red/70 font-serif italic">
            Exquisite Dining Experience - Table {restaurantId}
          </p>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="flex items-center gap-2 transition-all border-custom-yellow bg-white hover:bg-custom-lightYellow"
        onClick={() => setIsCartOpen(restaurantId, true)}
      >
        <ShoppingCart size={18} className="text-custom-red" />
        <span className="hidden md:inline text-custom-red">Cart</span>
        {cartCount > 0 && (
          <span className="flex items-center justify-center bg-custom-red text-white text-xs font-bold rounded-full h-5 w-5 ml-1">
            {cartCount}
          </span>
        )}
      </Button>
    </header>
  );
};

export default Header;

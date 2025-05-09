
import React, { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { MenuItem, CartItem } from "@/types";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";
import AvailabilityTag from "./AvailabilityTag";

export interface MenuItemCardProps {
  item: MenuItem;
  restaurantId: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurantId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useOrderSystem();

  const isAvailable = isMenuItemAvailable(item.id);
  const discountedPrice = getDiscountedPrice(item);
  
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: item.id,
      nameEn: item.nameEn,
      nameHi: item.nameHi,
      nameJa: item.nameJa,
      price: discountedPrice,
      quantity,
      image: item.image,
      imageUrl: item.imageUrl,
    };
    
    addToCart(restaurantId, cartItem);
    setIsAdded(true);
    
    // Reset after animation
    setTimeout(() => {
      setIsAdded(false);
      setIsExpanded(false);
      setQuantity(1);
    }, 1500);
  };

  return (
    <Card 
      className={`menu-item-card overflow-hidden border border-restaurant-secondary/20 transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'} ${!isAvailable ? "opacity-75 cursor-not-allowed" : ""}`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image || item.imageUrl}
          alt={item.nameEn}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {item.isVeg && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Veg</span>
          )}
          {item.isSpicy && (
            <span className="bg-restaurant-primary text-white text-xs px-2 py-0.5 rounded-full">Spicy</span>
          )}
          {item.isPopular && (
            <span className="bg-restaurant-secondary text-taj-dark text-xs px-2 py-0.5 rounded-full">Popular</span>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-restaurant-primary font-serif">{item.nameEn}</h3>
          <p className="text-sm text-restaurant-primary/70 font-serif">{item.nameHi || item.nameJa}</p>
        </div>
        
        <p className="text-restaurant-secondary font-medium mb-2">
          {discountedPrice < item.price ? (
            <>
              <span className="line-through text-gray-400 mr-2">{formatCurrency(item.price)}</span>
              {formatCurrency(discountedPrice)}
            </>
          ) : (
            formatCurrency(item.price)
          )}
        </p>
        
        {isExpanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            <p className="text-sm text-restaurant-primary/80">{item.description}</p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-restaurant-primary text-restaurant-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                >
                  <Minus size={16} />
                </Button>
                
                <span className="mx-3 font-medium">{quantity}</span>
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-restaurant-primary text-restaurant-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuantity(quantity + 1);
                  }}
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              <div>
                <AvailabilityTag itemId={item.id} price={item.price} />
                
                {isAvailable ? (
                  <Button
                    className={`bg-restaurant-primary hover:bg-restaurant-primary/80 text-taj-cream ${
                      isAdded ? "bg-green-600 hover:bg-green-600" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                  >
                    {isAdded ? <Check className="mr-1" size={16} /> : null}
                    {isAdded ? "Added" : "Add to Cart"}
                  </Button>
                ) : (
                  <Button 
                    disabled
                    variant="outline"
                  >
                    Not Available
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;

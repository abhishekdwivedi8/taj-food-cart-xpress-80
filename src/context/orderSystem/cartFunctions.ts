
import { toast } from "@/components/ui/sonner";
import { CartItem } from '@/types';

export const createCartFunctions = (
  cartItems: Record<number, CartItem[]>,
  setCartItems: React.Dispatch<React.SetStateAction<Record<number, CartItem[]>>>
) => {
  // Cart management functions
  const addToCart = (restaurantId: number, item: CartItem) => {
    setCartItems((prev) => {
      const restaurantCart = prev[restaurantId] || [];
      const existingItemIndex = restaurantCart.findIndex((i) => i.id === item.id);
      
      let updatedRestaurantCart;
      if (existingItemIndex > -1) {
        updatedRestaurantCart = [...restaurantCart];
        updatedRestaurantCart[existingItemIndex].quantity += item.quantity;
        toast(`Added ${item.quantity} more ${item.nameEn} to your cart`);
      } else {
        updatedRestaurantCart = [...restaurantCart, item];
        toast(`Added ${item.nameEn} to your cart`);
      }

      return {
        ...prev,
        [restaurantId]: updatedRestaurantCart
      };
    });
  };

  const updateQuantity = (restaurantId: number, id: string, quantity: number) => {
    setCartItems((prev) => {
      const restaurantCart = prev[restaurantId] || [];
      const updatedRestaurantCart = restaurantCart
        .map((item) => item.id === id ? { ...item, quantity } : item)
        .filter((item) => item.quantity > 0);

      return {
        ...prev,
        [restaurantId]: updatedRestaurantCart
      };
    });
  };

  const removeFromCart = (restaurantId: number, id: string) => {
    setCartItems((prev) => {
      const restaurantCart = prev[restaurantId] || [];
      const updatedRestaurantCart = restaurantCart.filter((item) => item.id !== id);

      return {
        ...prev,
        [restaurantId]: updatedRestaurantCart
      };
    });
  };

  const clearCart = (restaurantId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [restaurantId]: []
    }));
  };

  const getCartTotal = (restaurantId: number) => {
    const restaurantCart = cartItems[restaurantId] || [];
    return restaurantCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = (restaurantId: number) => {
    const restaurantCart = cartItems[restaurantId] || [];
    return restaurantCart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount
  };
};

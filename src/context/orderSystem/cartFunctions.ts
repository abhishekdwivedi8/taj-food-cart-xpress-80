import { MenuItem } from "../../data/menuItems";
import { CartItem, State } from "./types";
import { DeepReadonly } from "../../types";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";
import { toast } from "@/components/ui/sonner";

export const createCartFunctions = (state: DeepReadonly<State>) => {
  // Add an item to a restaurant's cart
  const addItemToCart = (restaurantId: number, item: MenuItem): CartItem[] => {
    // Check if item is available
    if (!isMenuItemAvailable(item.id)) {
      toast.error("This item is currently unavailable");
      return state.carts[restaurantId] || [];
    }
    
    // Get the current cart for the restaurant
    const currentCart = state.carts[restaurantId] || [];

    // Calculate discounted price based on availability settings
    const discountedPrice = getDiscountedPrice(item);
    
    // Check if the item already exists in the cart
    const existingItemIndex = currentCart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // If the item exists, increase its quantity
      return currentCart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // If the item doesn't exist, add it to the cart
      const cartItem: CartItem = {
        ...item,
        price: discountedPrice, // Use the discounted price
        quantity: 1,
      };
      return [...currentCart, cartItem];
    }
  };

  // Remove an item from a restaurant's cart
  const removeItemFromCart = (restaurantId: number, itemId: string): CartItem[] => {
    // Get the current cart for the restaurant
    const currentCart = state.carts[restaurantId] || [];

    // Find the item in the cart
    const itemIndex = currentCart.findIndex((cartItem) => cartItem.id === itemId);

    if (itemIndex === -1) {
      // If the item doesn't exist, return the current cart
      return currentCart;
    } else if (currentCart[itemIndex].quantity > 1) {
      // If the item exists and quantity is greater than 1, decrease the quantity
      return currentCart.map((cartItem, index) =>
        index === itemIndex
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    } else {
      // If the item exists and quantity is 1, remove the item from the cart
      return currentCart.filter((cartItem) => cartItem.id !== itemId);
    }
  };

  // Clear a restaurant's cart
  const clearCart = (restaurantId: number): CartItem[] => {
    return [];
  };

  return {
    addItemToCart,
    removeItemFromCart,
    clearCart,
  };
};

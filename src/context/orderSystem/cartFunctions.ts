
import { menuItems } from "../../data/menuItems";
import { CartItem } from "../../types";

// Create cart functions using state
export const createCartFunctions = (state: { carts: Record<number, CartItem[]>, deviceId: string }) => {
  // Add item to cart
  const addItemToCart = (restaurantId: number, item: Partial<CartItem>): CartItem[] => {
    const cartItems = [...(state.carts[restaurantId] || [])];
    
    // Check if the item is already in the cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1)
      };
      return updatedItems;
    } else {
      // Add new item with quantity defaulted to 1 if not provided
      const newItem: CartItem = {
        id: item.id!,
        nameEn: item.nameEn!,
        nameHi: item.nameHi,
        nameJa: item.nameJa,
        price: item.price!,
        quantity: item.quantity || 1,
        image: item.image,
        imageUrl: item.imageUrl
      };
      return [...cartItems, newItem];
    }
  };

  // Remove item from cart
  const removeItemFromCart = (restaurantId: number, itemId: string): CartItem[] => {
    const cartItems = [...(state.carts[restaurantId] || [])];
    return cartItems.filter(item => item.id !== itemId);
  };

  // Clear cart for a restaurant
  const clearCart = (restaurantId: number): CartItem[] => {
    return [];
  };

  // Calculate cart total
  const getCartTotal = (restaurantId: number): number => {
    const cartItems = state.carts[restaurantId] || [];
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Get cart item count
  const getCartCount = (restaurantId: number): number => {
    const cartItems = state.carts[restaurantId] || [];
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    addItemToCart,
    removeItemFromCart,
    clearCart,
    getCartTotal,
    getCartCount
  };
};

// For standalone use
export const addItemToCart = (
  cartItems: Record<number, CartItem[]>,
  restaurantId: number,
  item: Partial<CartItem>
): Record<number, CartItem[]> => {
  const newCartItems = { ...cartItems };

  if (!newCartItems[restaurantId]) {
    newCartItems[restaurantId] = [];
  }

  // Check if the item is already in the cart
  const existingItemIndex = newCartItems[restaurantId].findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex >= 0) {
    // Create a new array to avoid modifying the readonly array
    const updatedItems = [...newCartItems[restaurantId]];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + (item.quantity || 1)
    };
    newCartItems[restaurantId] = updatedItems;
  } else {
    // Add new item with quantity defaulted to 1 if not provided
    const newItem: CartItem = {
      id: item.id!,
      nameEn: item.nameEn!,
      nameHi: item.nameHi,
      nameJa: item.nameJa,
      price: item.price!,
      quantity: item.quantity || 1,
      image: item.image,
      imageUrl: item.imageUrl
    };
    newCartItems[restaurantId] = [...newCartItems[restaurantId], newItem];
  }

  return newCartItems;
};

// Remove item from cart
export const removeItemFromCart = (
  cartItems: Record<number, CartItem[]>,
  restaurantId: number,
  itemId: string
): Record<number, CartItem[]> => {
  const newCartItems = { ...cartItems };

  if (!newCartItems[restaurantId]) {
    return cartItems;
  }

  // Create a new array with the item removed
  newCartItems[restaurantId] = newCartItems[restaurantId].filter(
    item => item.id !== itemId
  );

  return newCartItems;
};

// Update item quantity
export const updateItemQuantity = (
  cartItems: Record<number, CartItem[]>,
  restaurantId: number,
  itemId: string,
  quantity: number
): Record<number, CartItem[]> => {
  const newCartItems = { ...cartItems };

  if (!newCartItems[restaurantId]) {
    return cartItems;
  }

  // Create a new array to avoid modifying the readonly array
  newCartItems[restaurantId] = newCartItems[restaurantId].map(item => {
    if (item.id === itemId) {
      return { ...item, quantity };
    }
    return item;
  });

  return newCartItems;
};

// Clear cart for a restaurant
export const clearCart = (
  cartItems: Record<number, CartItem[]>,
  restaurantId: number
): Record<number, CartItem[]> => {
  const newCartItems = { ...cartItems };
  newCartItems[restaurantId] = [];
  return newCartItems;
};

// Calculate cart total
export const getCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

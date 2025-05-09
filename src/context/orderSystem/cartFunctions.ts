
import { menuItems } from "../../data/menuItems";
import { CartItem, DeepReadonly } from "../../types";

// Add item to cart
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

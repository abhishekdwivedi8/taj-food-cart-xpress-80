
import Cookies from 'js-cookie';
import { MenuItem } from '@/types';

// Type definition for menu item availability
export type MenuItemAvailability = {
  id: string;
  available: boolean;
  discount?: number; // Discount percentage (0-100)
};

// Type for the entire availability mapping
export type AvailabilityMap = {
  [itemId: string]: MenuItemAvailability;
};

// Get menu item availability from cookies
export const getMenuItemsAvailability = (): AvailabilityMap => {
  try {
    const availabilityJson = Cookies.get('menu_items_availability');
    if (!availabilityJson) return {};
    return JSON.parse(availabilityJson);
  } catch (error) {
    console.error('Error getting menu items availability:', error);
    return {};
  }
};

// Save menu item availability to cookies
export const saveMenuItemsAvailability = (availability: AvailabilityMap): void => {
  try {
    Cookies.set('menu_items_availability', JSON.stringify(availability), { expires: 30 });
  } catch (error) {
    console.error('Error saving menu items availability:', error);
  }
};

// Update a single menu item's availability
export const updateMenuItemAvailability = (
  itemId: string, 
  available: boolean, 
  discount?: number
): void => {
  const currentAvailability = getMenuItemsAvailability();
  
  currentAvailability[itemId] = {
    id: itemId,
    available,
    discount: discount !== undefined ? discount : currentAvailability[itemId]?.discount
  };
  
  saveMenuItemsAvailability(currentAvailability);
};

// Check if a menu item is available
export const isMenuItemAvailable = (itemId: string): boolean => {
  const availability = getMenuItemsAvailability();
  // If no entry exists, consider it available by default
  if (!availability[itemId]) return true;
  return availability[itemId].available;
};

// Get discount percentage for a menu item (0 if not discounted)
export const getMenuItemDiscount = (itemId: string): number => {
  const availability = getMenuItemsAvailability();
  if (!availability[itemId] || !availability[itemId].discount) return 0;
  return availability[itemId].discount || 0;
};

// Calculate the discounted price of a menu item
export const getDiscountedPrice = (item: MenuItem): number => {
  const discount = getMenuItemDiscount(item.id);
  if (!discount) return item.price;
  
  return item.price - (item.price * (discount / 100));
};

// Initialize availability for all menu items
export const initializeAvailability = (menuItems: MenuItem[]): void => {
  const currentAvailability = getMenuItemsAvailability();
  
  // Ensure all menu items have an entry in the availability map
  const newAvailability = { ...currentAvailability };
  
  menuItems.forEach(item => {
    if (!newAvailability[item.id]) {
      newAvailability[item.id] = {
        id: item.id,
        available: true, // Default to available
        discount: 0 // Default to no discount
      };
    }
  });
  
  saveMenuItemsAvailability(newAvailability);
};

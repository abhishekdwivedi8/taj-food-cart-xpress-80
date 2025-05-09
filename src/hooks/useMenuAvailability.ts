
import { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { 
  getMenuItemsAvailability, 
  saveMenuItemsAvailability,
  updateMenuItemAvailability,
  isMenuItemAvailable,
  getMenuItemDiscount,
  getDiscountedPrice,
  AvailabilityMap
} from '@/utils/menuManagementUtils';

export const useMenuAvailability = (menuItems: MenuItem[]) => {
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load availability data on component mount
  useEffect(() => {
    const loadAvailability = () => {
      const currentAvailability = getMenuItemsAvailability();
      setAvailability(currentAvailability);
      setIsLoaded(true);
    };
    
    loadAvailability();
  }, []);

  // Update availability for a specific menu item
  const setItemAvailability = (itemId: string, available: boolean) => {
    updateMenuItemAvailability(itemId, available);
    
    setAvailability(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        id: itemId,
        available
      }
    }));
  };

  // Update discount for a specific menu item
  const setItemDiscount = (itemId: string, discount: number) => {
    updateMenuItemAvailability(
      itemId, 
      availability[itemId]?.available ?? true,
      discount
    );
    
    setAvailability(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        id: itemId,
        discount
      }
    }));
  };

  // Initialize menu items that don't have availability settings yet
  useEffect(() => {
    if (isLoaded && menuItems.length > 0) {
      const newAvailability = { ...availability };
      let hasChanges = false;
      
      menuItems.forEach(item => {
        if (!newAvailability[item.id]) {
          newAvailability[item.id] = {
            id: item.id,
            available: true,
            discount: 0
          };
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        saveMenuItemsAvailability(newAvailability);
        setAvailability(newAvailability);
      }
    }
  }, [menuItems, isLoaded, availability]);

  // Helper to check if a specific item is available
  const checkItemAvailability = (itemId: string) => {
    return availability[itemId]?.available ?? true;
  };

  // Helper to get discount for a specific item
  const getItemDiscount = (itemId: string) => {
    return availability[itemId]?.discount ?? 0;
  };

  // Helper to calculate the final price with discount
  const calculateFinalPrice = (item: MenuItem) => {
    const discount = getItemDiscount(item.id);
    if (!discount) return item.price;
    
    return item.price - (item.price * (discount / 100));
  };

  return {
    availability,
    setItemAvailability,
    setItemDiscount,
    checkItemAvailability,
    getItemDiscount,
    calculateFinalPrice,
    isLoaded
  };
};

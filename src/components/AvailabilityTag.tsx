
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { isMenuItemAvailable, getMenuItemDiscount, getDiscountedPrice } from '@/utils/menuManagementUtils';

interface AvailabilityTagProps {
  itemId: string;
  price: number;
}

const AvailabilityTag: React.FC<AvailabilityTagProps> = ({ itemId, price }) => {
  const [showNotAvailable, setShowNotAvailable] = useState(false);
  
  const isAvailable = isMenuItemAvailable(itemId);
  const discount = getMenuItemDiscount(itemId);
  const finalPrice = discount > 0 ? getDiscountedPrice({ id: itemId, price } as any) : price;
  
  // Show the "Not available" message for 1 second
  const handleUnavailableClick = () => {
    if (!isAvailable) {
      setShowNotAvailable(true);
      toast.error("Item is currently unavailable", {
        duration: 1000
      });
      setTimeout(() => {
        setShowNotAvailable(false);
      }, 1000);
    }
  };
  
  if (!isAvailable) {
    return (
      <div onClick={handleUnavailableClick}>
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Not Available
        </Badge>
      </div>
    );
  }
  
  if (discount > 0) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        {discount}% OFF
      </Badge>
    );
  }
  
  return null;
};

export default AvailabilityTag;

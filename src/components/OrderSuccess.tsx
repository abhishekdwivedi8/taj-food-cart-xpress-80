
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useOrderSystem } from "@/context/OrderSystemContext";

interface OrderSuccessProps {
  restaurantId: number;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ restaurantId }) => {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen } = useOrderSystem();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOrderSuccessOpen[restaurantId]) {
      timer = setTimeout(() => {
        setIsOrderSuccessOpen(restaurantId, false);
      }, 2000); // Reduced to 2 seconds from 3
    }
    return () => clearTimeout(timer);
  }, [isOrderSuccessOpen, setIsOrderSuccessOpen, restaurantId]);

  if (!isOrderSuccessOpen[restaurantId]) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full order-success border-t-4 border-custom-green">
        <div className="flex flex-col items-center">
          <CheckCircle size={64} className="text-custom-green mb-4" />
          <h3 className="text-2xl font-bold text-custom-red mb-2">
            Order Placed Successfully!
          </h3>
          <p className="text-center text-gray-600 mb-1">
            Your order will be served to you soon.
          </p>
          <p className="text-center text-gray-500 text-sm">
            This message will disappear in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

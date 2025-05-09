
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { toast } from "sonner";

interface OrderSuccessProps {
  restaurantId: number;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ restaurantId }) => {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen } = useOrderSystem();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOrderSuccessOpen[restaurantId]) {
      // Show a toast notification when order success appears
      toast.success("Order placed successfully! Your food will be ready soon.", {
        duration: 4000,
      });
      
      // Auto-close the success modal
      timer = setTimeout(() => {
        setIsOrderSuccessOpen(restaurantId, false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isOrderSuccessOpen, setIsOrderSuccessOpen, restaurantId]);

  if (!isOrderSuccessOpen[restaurantId]) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full bounce-in border-t-4 border-custom-green">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <CheckCircle size={70} className="text-custom-green pulse-effect" />
            <div className="absolute inset-0 bg-custom-green/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
          <h3 className="text-2xl font-bold text-custom-red mb-2 slide-in-right">
            Order Placed Successfully!
          </h3>
          <p className="text-center text-custom-darkGray mb-2 fade-in-effect" style={{ animationDelay: '0.2s' }}>
            Your order will be served to you soon.
          </p>
          <p className="text-center text-custom-darkGray/70 text-sm fade-in-effect" style={{ animationDelay: '0.4s' }}>
            This message will disappear in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

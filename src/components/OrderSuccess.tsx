
import React, { useEffect } from "react";
import { CheckCircle, Clock, ChefHat } from "lucide-react";
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
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isOrderSuccessOpen, setIsOrderSuccessOpen, restaurantId]);

  if (!isOrderSuccessOpen[restaurantId]) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-custom-darkGray/90 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full bounce-in border-t-4 border-custom-green">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <CheckCircle size={70} className="text-custom-green animate-bounce" />
            <div className="absolute inset-0 bg-custom-green/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
          <h3 className="text-2xl font-bold text-custom-red mb-4 slide-in-right">
            Order Placed Successfully!
          </h3>
          
          <div className="w-full bg-custom-lightGreen p-4 rounded-lg border border-custom-green/20 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <ChefHat className="text-custom-green" size={18} />
              <p className="text-custom-darkGray font-medium">Your order is being prepared</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-custom-yellow" size={18} />
              <p className="text-custom-darkGray">Estimated serving time: 15-20 mins</p>
            </div>
          </div>
          
          {/* Visual progress bar */}
          <div className="w-full h-2 bg-custom-lightGray rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-custom-green rounded-full" style={{
              width: '30%',
              animation: 'progress 3s infinite ease-in-out'
            }}></div>
          </div>
          
          <p className="text-center text-custom-darkGray mb-1 fade-in-effect" style={{ animationDelay: '0.2s' }}>
            Your order will be served to you soon.
          </p>
          <p className="text-center text-custom-darkGray/70 text-sm fade-in-effect" style={{ animationDelay: '0.4s' }}>
            This message will disappear in a few seconds...
          </p>
        </div>
      </div>
      
      <style>
        {`
          @keyframes progress {
            0% { width: 20%; }
            50% { width: 40%; }
            100% { width: 20%; }
          }
        `}
      </style>
    </div>
  );
};

export default OrderSuccess;

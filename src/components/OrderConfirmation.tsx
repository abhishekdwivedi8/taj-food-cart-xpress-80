
import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";

interface OrderConfirmationProps {
  restaurantId: number;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ restaurantId }) => {
  const {
    cartItems,
    getCartTotal,
    placeOrder,
    isOrderConfirmOpen,
    setIsOrderConfirmOpen,
  } = useOrderSystem();

  const restaurantCart = cartItems[restaurantId] || [];
  const cartTotal = getCartTotal(restaurantId);

  if (!isOrderConfirmOpen[restaurantId]) return null;

  const handlePlaceOrder = () => {
    placeOrder(restaurantId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={() => setIsOrderConfirmOpen(restaurantId, false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-6">
          <AlertCircle size={48} className="text-[#5B0018] mb-3" />
          <h3 className="text-2xl font-semibold text-[#5B0018] font-serif">
            Confirm Your Order
          </h3>
          <p className="text-gray-600 text-center mt-1">
            Are you sure you want to place this order?
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto mb-6 bg-[#F5F5DC]/50 rounded-lg p-4 shadow-inner">
          <p className="font-medium text-[#5B0018] mb-2">Order Summary:</p>
          <div className="space-y-2">
            {restaurantCart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2 px-1 border-b border-gray-300"
              >
                <span className="text-gray-700">
                  {item.quantity} × {item.nameEn}
                </span>
                <span className="font-medium text-[#5B0018]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 pt-2 border-t-2 border-[#5B0018]/30">
            <span className="font-bold text-[#5B0018]">Total:</span>
            <span className="font-bold text-[#5B0018]">{formatCurrency(cartTotal)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 border-[#5B0018] text-[#5B0018] hover:bg-gray-100"
            onClick={() => setIsOrderConfirmOpen(restaurantId, false)}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#5B0018] shadow-md font-semibold"
            onClick={handlePlaceOrder}
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

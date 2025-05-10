
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setIsOrderConfirmOpen(restaurantId, false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-6">
          <AlertCircle size={48} className="text-restaurant-secondary mb-3" />
          <h3 className="text-2xl font-semibold text-restaurant-primary font-serif">
            Confirm Your Order
          </h3>
          <p className="text-gray-600 text-center mt-1">
            Are you sure you want to place this order?
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto mb-6">
          <p className="font-medium text-gray-800 mb-2">Order Summary:</p>
          <div className="space-y-2">
            {restaurantCart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-1 border-b border-gray-200"
              >
                <span className="text-gray-700">
                  {item.quantity} × {item.nameEn}
                </span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 font-bold text-gray-900">
            <span>Total:</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 border-restaurant-primary text-restaurant-primary hover:bg-restaurant-primary/10"
            onClick={() => setIsOrderConfirmOpen(restaurantId, false)}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-restaurant-primary hover:bg-restaurant-primary/80 text-white"
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

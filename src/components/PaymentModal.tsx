
import React, { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import PaymentMethods from "./payment/PaymentMethods";
import PaymentSuccess from "./payment/PaymentSuccess";
import { toast } from "@/components/ui/sonner";

interface PaymentModalProps {
  restaurantId: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ restaurantId }) => {
  const { getOrderById, isPaymentOpen, setIsPaymentOpen, completePayment, orderHistory } = useOrderSystem();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Find customer's unpaid orders for this restaurant
  const unpaidOrders = orderHistory.filter(order => !order.isPaid);
  const order = selectedOrderId ? getOrderById(selectedOrderId) : 
                unpaidOrders.length > 0 ? getOrderById(unpaidOrders[0].id) : null;
  
  const totalAmount = order ? order.total : 0;

  useEffect(() => {
    // Set the first unpaid order as selected when the modal opens
    if (isPaymentOpen[restaurantId] && unpaidOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(unpaidOrders[0].id);
    }
  }, [isPaymentOpen, restaurantId, unpaidOrders, selectedOrderId]);

  const handlePayment = () => {
    if (!paymentMethod || !selectedOrderId) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Auto redirect after payment
      setTimeout(() => {
        // Complete payment in context but don't delete history
        completePayment(selectedOrderId, paymentMethod as 'online' | 'cash');
        
        // Close payment modal and show success toast
        setIsPaymentOpen(restaurantId, false);
        toast.success("Thank you for your payment! Your order is being prepared.");
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    if (isPaymentOpen[restaurantId]) {
      setPaymentMethod("");
      setIsProcessing(false);
      setIsComplete(false);
    }
  }, [isPaymentOpen, restaurantId]);

  if (!isPaymentOpen[restaurantId]) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => !isProcessing && !isComplete && setIsPaymentOpen(restaurantId, false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {isComplete ? (
          <PaymentSuccess />
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-taj-burgundy text-white">
              <div className="flex items-center gap-2">
                <CreditCard size={20} />
                <h2 className="text-xl font-semibold font-serif">Payment</h2>
              </div>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-restaurant-primary/80"
                  onClick={() => setIsPaymentOpen(restaurantId, false)}
                >
                  <X size={20} />
                </Button>
              )}
            </div>

            <div className="p-6">
              <PaymentMethods 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                totalAmount={totalAmount}
              />

              <Button
                className="w-full bg-restaurant-primary hover:bg-restaurant-primary/80 text-white h-12 font-medium"
                disabled={!paymentMethod || isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

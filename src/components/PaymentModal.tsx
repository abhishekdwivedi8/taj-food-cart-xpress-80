
import React, { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import PaymentMethods from "./payment/PaymentMethods";
import PaymentSuccess from "./payment/PaymentSuccess";
import MobileNumberInput from "./payment/MobileNumberInput";
import ReviewOverlay from "./reviews/ReviewOverlay";
import { toast } from "@/components/ui/sonner";
import { supabaseClient } from "@/utils/supabaseClient";
import { saveOrderHistoryMultiple, clearOrderHistory } from "@/utils/orderStorageUtils";

interface PaymentModalProps {
  restaurantId: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ restaurantId }) => {
  const { getOrderById, isPaymentOpen, setIsPaymentOpen, completePayment, orderHistory } = useOrderSystem();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showReviewOverlay, setShowReviewOverlay] = useState(false);

  // Find customer's unpaid orders for this restaurant
  const unpaidOrders = orderHistory.filter(
    order => !order.isPaid && order.restaurantId === restaurantId
  );
  const order = selectedOrderId ? getOrderById(selectedOrderId) : 
                unpaidOrders.length > 0 ? getOrderById(unpaidOrders[0].id) : null;
  
  const totalAmount = order ? order.total : 0;

  useEffect(() => {
    // Set the first unpaid order as selected when the modal opens
    if (isPaymentOpen[restaurantId] && unpaidOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(unpaidOrders[0].id);
    }
  }, [isPaymentOpen, restaurantId, unpaidOrders, selectedOrderId]);

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    setShowMobileInput(true);
  };

  const handleMobileSubmit = async (mobile: string) => {
    if (!selectedOrderId || !order) return;
    
    setMobileNumber(mobile);
    setIsProcessing(true);
    
    try {
      // Save customer mobile number to Supabase
      const { error: customerError } = await supabaseClient
        .from('customers')
        .insert({
          id: order.customerId,
          mobile_number: mobile,
          last_order_id: order.id,
          last_order_date: order.date,
          restaurant_id: restaurantId
        });
      
      if (customerError && customerError.code !== '23505') { // Ignore duplicate key errors
        console.error("Error saving customer data:", customerError);
      }
      
      // Update order in Supabase with mobile number
      const { error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          id: order.id,
          customer_id: order.customerId,
          restaurant_id: restaurantId,
          items: order.items,
          total: order.total,
          payment_method: paymentMethod,
          mobile_number: mobile,
          order_date: order.date,
          status: order.status
        });
      
      if (orderError) {
        console.error("Error saving order data:", orderError);
      }
      
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
        
        // Auto redirect after payment
        setTimeout(() => {
          // Complete payment in context
          completePayment(selectedOrderId, paymentMethod as 'online' | 'cash');
          
          // Close payment modal and show review overlay
          setIsPaymentOpen(restaurantId, false);
          setShowReviewOverlay(true);
          
          toast.success("Thank you for your payment! Your order is being prepared.");
        }, 2000);
      }, 2000);
    } catch (error) {
      console.error("Payment process error:", error);
      setIsProcessing(false);
      toast.error("There was an error processing your payment. Please try again.");
    }
  };

  const handleReviewComplete = () => {
    setShowReviewOverlay(false);
    
    // Clear all order history cookies
    clearOrderHistory();
    
    // Reload the page for a fresh start
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
  // Close review overlay if clicked outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowReviewOverlay(false);
      clearOrderHistory();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  useEffect(() => {
    if (isPaymentOpen[restaurantId]) {
      setPaymentMethod("");
      setIsProcessing(false);
      setIsComplete(false);
      setShowMobileInput(false);
      setMobileNumber("");
    }
  }, [isPaymentOpen, restaurantId]);

  if (!isPaymentOpen[restaurantId]) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={() => !isProcessing && !isComplete && setIsPaymentOpen(restaurantId, false)}
      >
        <div
          className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in duration-300 card-gradient"
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
                {!showMobileInput ? (
                  <PaymentMethods 
                    paymentMethod={paymentMethod}
                    setPaymentMethod={handlePaymentMethodSelect}
                    totalAmount={totalAmount}
                  />
                ) : (
                  <MobileNumberInput 
                    onSubmit={handleMobileSubmit}
                    isProcessing={isProcessing}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Review overlay appears after payment completion */}
      {order && (
        <ReviewOverlay
          isOpen={showReviewOverlay}
          onClose={handleReviewComplete}
          items={order.items}
          orderId={order.id}
          restaurantId={restaurantId}
          customerId={order.customerId}
          onOutsideClick={handleOutsideClick}
        />
      )}
    </>
  );
};

export default PaymentModal;

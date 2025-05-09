
import React, { useState, useEffect } from "react";
import { X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import PaymentMethods from "./payment/PaymentMethods";
import PaymentGateway from "./payment/PaymentGateway";
import PaymentSuccess from "./payment/PaymentSuccess";
import MobileNumberInput from "./payment/MobileNumberInput";
import ReviewOverlay from "./reviews/ReviewOverlay";
import { toast } from "sonner";
import { supabaseClient } from "@/utils/supabaseClient";
import { saveOrderHistoryMultiple, clearOrderHistory } from "@/utils/orderStorageUtils";
import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentModalProps {
  restaurantId: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ restaurantId }) => {
  const { getOrderById, isPaymentOpen, setIsPaymentOpen, completePayment, orderHistory } = useOrderSystem();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
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
      
      // Show payment gateway
      setShowPaymentGateway(true);
      setShowMobileInput(false);
      
    } catch (error) {
      console.error("Error processing mobile number:", error);
      toast.error("There was an error processing your information. Please try again.");
    }
  };

  const handlePaymentComplete = (method: string) => {
    if (!selectedOrderId) return;
    
    setIsProcessing(false);
    setIsComplete(true);
    
    // Auto redirect after payment
    setTimeout(() => {
      // Complete payment in context
      completePayment(selectedOrderId, method as 'online' | 'cash');
      
      // Close payment modal and show review overlay
      setIsPaymentOpen(restaurantId, false);
      setShowReviewOverlay(true);
      
      toast.success("Thank you for your payment! Your order is being prepared.");
    }, 1500);
  };

  const handleReviewComplete = () => {
    setShowReviewOverlay(false);
    
    // Clear all order history cookies
    clearOrderHistory();
    
    // Reload the page for a fresh start
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  // Close review overlay if clicked outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowReviewOverlay(false);
      clearOrderHistory();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleBackFromPaymentGateway = () => {
    setShowPaymentGateway(false);
    setShowMobileInput(true);
  };

  useEffect(() => {
    if (isPaymentOpen[restaurantId]) {
      setPaymentMethod("");
      setIsProcessing(false);
      setIsComplete(false);
      setShowMobileInput(false);
      setShowPaymentGateway(false);
      setMobileNumber("");
    }
  }, [isPaymentOpen, restaurantId]);

  if (!isPaymentOpen[restaurantId]) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
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
              <div className="flex items-center justify-between p-4 border-b bg-custom-red text-white">
                <div className="flex items-center gap-2">
                  <CreditCard size={20} />
                  <h2 className="text-xl font-semibold font-serif">
                    {showPaymentGateway ? "Payment Gateway" : "Payment"}
                  </h2>
                </div>
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-custom-red/80"
                    onClick={() => setIsPaymentOpen(restaurantId, false)}
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>

              <div className="p-6 bg-white">
                {!showMobileInput && !showPaymentGateway ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-medium text-lg mb-2 text-gray-800">
                        Amount to Pay
                      </h3>
                      <div className="text-3xl font-bold text-custom-red">
                        {formatCurrency(totalAmount)}
                      </div>
                    </div>
                    <PaymentMethods 
                      paymentMethod={paymentMethod}
                      setPaymentMethod={handlePaymentMethodSelect}
                      totalAmount={totalAmount}
                    />
                  </>
                ) : showMobileInput ? (
                  <MobileNumberInput 
                    onSubmit={handleMobileSubmit}
                    isProcessing={isProcessing}
                  />
                ) : showPaymentGateway ? (
                  <PaymentGateway 
                    onBack={handleBackFromPaymentGateway}
                    onComplete={handlePaymentComplete}
                    mobileNumber={mobileNumber}
                    amount={totalAmount}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                ) : null}
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

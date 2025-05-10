
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeedbackOverlay from "@/components/feedback/FeedbackOverlay";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { CartItem } from "@/types";

interface PaymentSuccessProps {
  onClose: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onClose }) => {
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const { getOrderById, getLatestCompletedOrderId } = useOrderSystem();

  // Get the latest completed order to collect feedback
  const latestOrderId = getLatestCompletedOrderId();
  const order = latestOrderId ? getOrderById(latestOrderId) : null;

  // Prepare order items for feedback
  const orderItems: CartItem[] = order?.items || [];
  const restaurantId = order?.restaurantId || 1;
  const orderId = order?.id || "";
  const customerId = order?.customerId || "";

  // Auto-redirect after payment success
  useEffect(() => {
    // Show feedback overlay after a short delay
    const feedbackTimer = setTimeout(() => {
      if (order && order.items.length > 0) {
        setShowFeedback(true);
      }
    }, 1000);

    // If the user doesn't interact with the feedback, still auto-close
    const timer = setTimeout(() => {
      if (!showFeedback) {
        onClose();
      }
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(feedbackTimer);
    };
  }, [onClose, order, showFeedback]);
  
  return (
    <>
      <div className="p-8 flex flex-col items-center justify-center">
        <CheckCircle size={64} className="text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Payment Successful!
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Thank you for your payment. Your order has been confirmed.
        </p>
        <Button onClick={onClose} className="mt-4">
          Back to Restaurant
        </Button>
        <p className="text-sm text-gray-500 mt-4 text-center">
          This window will automatically close in a few seconds...
        </p>
      </div>

      {/* Feedback overlay */}
      <FeedbackOverlay
        isOpen={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          onClose();
        }}
        orderedItems={orderItems}
        restaurantId={restaurantId}
        orderId={orderId}
        customerId={customerId}
      />
    </>
  );
};

export default PaymentSuccess;

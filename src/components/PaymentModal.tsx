
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { saveOrderHistoryMultiple, updateOrderInHistory, getOrderHistoryFromMultipleSources } from "@/utils/orderStorageUtils";
import { PaymentMethods } from "./payment/PaymentMethods";
import { PaymentGateway } from "./payment/PaymentGateway";
import { PaymentSuccess } from "./payment/PaymentSuccess";
import { toast } from "sonner";
import { OrderWithStatus } from "@/context/orderSystem";

interface PaymentModalProps {
  restaurantId: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ restaurantId }) => {
  const { 
    isPaymentOpen, 
    setIsPaymentOpen, 
    completePayment,
    getOrderById 
  } = useOrderSystem();
  
  const [activeStep, setActiveStep] = useState<"methods" | "gateway" | "success">("methods");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "upi" | "">("");
  const [unpaidOrders, setUnpaidOrders] = useState<OrderWithStatus[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (isPaymentOpen[restaurantId]) {
      // Get all unpaid orders from all storage mechanisms
      const allOrders = getOrderHistoryFromMultipleSources();
      const unpaid = allOrders.filter(
        order => !order.isPaid && order.restaurantId === restaurantId
      );
      setUnpaidOrders(unpaid);
    }
  }, [isPaymentOpen, restaurantId]);

  const handleSelectMethod = (method: "card" | "upi") => {
    setSelectedMethod(method);
    setActiveStep("gateway");
  };

  const handlePaymentSuccess = () => {
    try {
      // Mark all unpaid orders as paid
      unpaidOrders.forEach(order => {
        completePayment(order.id, selectedMethod as 'online' | 'cash');
      });
      
      // Update the orders in global storage
      const allOrders = getOrderHistoryFromMultipleSources();
      const updatedOrders = allOrders.map(order => {
        if (!order.isPaid && order.restaurantId === restaurantId) {
          return { ...order, isPaid: true };
        }
        return order;
      });
      
      // Save the updated orders back to storage
      saveOrderHistoryMultiple(updatedOrders);
      
      setActiveStep("success");
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    if (activeStep === "success") {
      // Only reset state if payment was successful
      setActiveStep("methods");
      setSelectedMethod("");
    }
    setIsPaymentOpen(restaurantId, false);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      handlePaymentSuccess();
    }, 2000);
  };

  const handleBack = () => {
    if (activeStep === "gateway") {
      setActiveStep("methods");
      setSelectedMethod("");
    }
  };

  if (!isPaymentOpen[restaurantId]) return null;

  // Calculate total amount to pay
  const totalAmount = unpaidOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleCloseModal}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">
            {activeStep === "success" ? "Payment Complete" : "Payment"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            disabled={isProcessingPayment}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          {activeStep === "methods" && (
            <PaymentMethods
              totalAmount={totalAmount}
              onSelectMethod={handleSelectMethod}
            />
          )}

          {activeStep === "gateway" && (
            <PaymentGateway
              method={selectedMethod}
              totalAmount={totalAmount}
              onBack={handleBack}
              onPay={handleProcessPayment}
              isProcessing={isProcessingPayment}
            />
          )}

          {activeStep === "success" && (
            <PaymentSuccess onClose={handleCloseModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

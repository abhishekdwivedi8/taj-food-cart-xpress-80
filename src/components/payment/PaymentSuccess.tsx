
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentSuccessProps {
  onClose: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ onClose }) => {
  // Auto-redirect after payment success
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
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
  );
};

export default PaymentSuccess;

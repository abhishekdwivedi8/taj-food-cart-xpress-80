
import React from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <CheckCircle size={64} className="text-green-500 mb-4" />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Payment Successful!
      </h3>
      <p className="text-gray-600 text-center mb-4">
        Thank you for your payment. Redirecting you back...
      </p>
    </div>
  );
};

export default PaymentSuccess;


import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { CreditCard, Smartphone, DollarSign, ShieldCheck } from "lucide-react";

interface PaymentMethodsProps {
  totalAmount: number;
  onSelectMethod: (method: "card" | "upi") => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  totalAmount,
  onSelectMethod,
}) => {
  const paymentMethods = [
    { 
      id: "card", 
      name: "Card Payment", 
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      description: "Credit/Debit Cards",
      secureLabel: "Bank-level security"
    },
    { 
      id: "upi", 
      name: "UPI Payment", 
      icon: <Smartphone className="h-6 w-6 text-green-500" />,
      description: "Google Pay, PhonePe, Paytm",
      secureLabel: "Instant & secure"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Amount to Pay:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={14} className="text-green-500" />
          <span>All payments are secure and encrypted</span>
        </div>
      </div>

      <h3 className="font-medium text-lg mb-3 text-gray-700">Select Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className="flex items-center gap-3 p-4 border rounded-lg w-full cursor-pointer transition-all border-gray-200 hover:border-green-500/50 hover:bg-green-50"
            onClick={() => onSelectMethod(method.id as "card" | "upi")}
          >
            <div className="p-3 rounded-full shadow-sm bg-white">
              {method.icon}
            </div>
            <div className="text-left flex-grow">
              <span className="font-medium text-gray-700 block">
                {method.name}
              </span>
              <p className="text-xs text-gray-500">{method.description}</p>
              <span className="inline-block text-xs mt-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {method.secureLabel}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;


import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { CreditCard, Smartphone, DollarSign, ShieldCheck } from "lucide-react";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  totalAmount: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethod,
  setPaymentMethod,
  totalAmount,
}) => {
  const paymentMethods = [
    { 
      id: "card", 
      name: "Card Payment", 
      icon: <CreditCard className="h-6 w-6 text-custom-blue" />,
      description: "Credit/Debit Cards",
      secureLabel: "Bank-level security"
    },
    { 
      id: "upi", 
      name: "UPI Payment", 
      icon: <Smartphone className="h-6 w-6 text-custom-green" />,
      description: "Google Pay, PhonePe, Paytm",
      secureLabel: "Instant & secure"
    },
    { 
      id: "cash", 
      name: "Cash Payment", 
      icon: <DollarSign className="h-6 w-6 text-custom-yellow" />,
      description: "Pay when your order arrives",
      secureLabel: "No advance payment"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-custom-lightBlue rounded-lg p-4 border border-custom-blue/20 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-custom-darkGray">Amount to Pay:</span>
          <span className="text-2xl font-bold text-custom-blue">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-custom-darkGray/70">
          <ShieldCheck size={14} className="text-custom-green" />
          <span>All payments are secure and encrypted</span>
        </div>
      </div>

      <h3 className="font-medium text-lg mb-3 text-custom-darkGray">Select Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`flex items-center gap-3 p-4 border rounded-lg w-full cursor-pointer transition-all ${
              paymentMethod === method.id
                ? "border-custom-green bg-custom-lightGreen shadow-md"
                : "border-custom-lightGray hover:border-custom-green/50 hover:bg-custom-lightGreen/10"
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <div className={`p-3 rounded-full shadow-sm ${
              paymentMethod === method.id 
                ? "bg-custom-green text-white" 
                : "bg-white"
            }`}>
              {method.icon}
            </div>
            <div className="text-left flex-grow">
              <span className="font-medium text-custom-darkGray block">
                {method.name}
              </span>
              <p className="text-xs text-custom-darkGray/70">{method.description}</p>
              <span className="inline-block text-xs mt-1 px-2 py-1 rounded-full bg-custom-lightGray/50 text-custom-darkGray">
                {method.secureLabel}
              </span>
            </div>
            <div>
              <div
                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === method.id
                    ? "bg-custom-green border-custom-green"
                    : "border-custom-lightGray"
                }`}
              >
                {paymentMethod === method.id && (
                  <div className="h-3 w-3 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;

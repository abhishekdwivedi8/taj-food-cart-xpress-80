
import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { CreditCard, Smartphone } from "lucide-react";

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
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      description: "Credit/Debit Cards"
    },
    { 
      id: "upi", 
      name: "UPI Payment", 
      icon: <Smartphone className="h-6 w-6 text-custom-green" />,
      description: "Google Pay, PhonePe, etc."
    },
    { 
      id: "cash", 
      name: "Cash Payment", 
      icon: <img src="https://cdn-icons-png.flaticon.com/512/2371/2371970.png" className="h-6 w-6" alt="Cash" />,
      description: "Pay with cash on delivery"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`flex items-center gap-3 p-4 border rounded-lg w-full cursor-pointer transition-all ${
              paymentMethod === method.id
                ? "border-custom-green bg-custom-lightGreen"
                : "border-gray-200 hover:border-custom-green/50 hover:bg-custom-lightGreen/10"
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <div className="bg-white p-2 rounded-full shadow-sm">
              {method.icon}
            </div>
            <div className="text-left">
              <span className="font-medium text-gray-800">
                {method.name}
              </span>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            <div className="ml-auto">
              <div
                className={`h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center ${
                  paymentMethod === method.id
                    ? "bg-custom-green border-custom-green"
                    : ""
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

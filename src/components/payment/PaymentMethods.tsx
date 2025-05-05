
import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";

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
    { id: "online", name: "Online Payment", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" },
    { id: "cash", name: "Cash Payment", icon: "https://cdn-icons-png.flaticon.com/512/2371/2371970.png" },
  ];

  return (
    <>
      <div className="mb-6">
        <h3 className="font-medium text-lg mb-2 text-gray-800">
          Amount to Pay
        </h3>
        <div className="text-3xl font-bold text-restaurant-primary">
          {formatCurrency(totalAmount)}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-lg mb-3 text-gray-800">
          Select Payment Method
        </h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? "border-restaurant-secondary bg-restaurant-secondary/10"
                  : "border-gray-200 hover:border-restaurant-secondary/50"
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center">
                <img
                  src={method.icon}
                  alt={method.name}
                  className="max-h-full max-w-full"
                />
              </div>
              <span className="font-medium text-gray-800">
                {method.name}
              </span>
              <div className="ml-auto">
                <div
                  className={`h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center ${
                    paymentMethod === method.id
                      ? "bg-restaurant-primary border-restaurant-primary"
                      : ""
                  }`}
                >
                  {paymentMethod === method.id && (
                    <div className="h-3 w-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;

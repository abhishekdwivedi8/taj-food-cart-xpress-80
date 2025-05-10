
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentGatewayProps {
  method: string;
  totalAmount: number;
  onBack: () => void;
  onPay: () => void;
  isProcessing: boolean;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  method,
  totalAmount,
  onBack,
  onPay,
  isProcessing
}) => {
  const isCard = method === "card";
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={onBack} 
          className="flex items-center text-red-500 hover:text-red-600 transition-colors"
          disabled={isProcessing}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </button>
        <h3 className="text-lg font-medium text-gray-700">
          {isCard ? "Card Details" : "UPI Payment"}
        </h3>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Amount:</span>
          <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {isCard ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                id="expiry"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                id="cvv"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name on Card</label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="John Doe"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-700 text-sm mb-2">Pay to UPI ID:</p>
            <p className="font-bold text-lg text-gray-800">restaurant@tajflavours</p>
          </div>
          
          <p className="text-sm text-gray-600">
            Open your UPI app and scan the QR code or enter the UPI ID to make payment.
          </p>
        </div>
      )}
      
      <Button
        onClick={onPay}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          `Pay ${formatCurrency(totalAmount)}`
        )}
      </Button>
    </div>
  );
};

export default PaymentGateway;

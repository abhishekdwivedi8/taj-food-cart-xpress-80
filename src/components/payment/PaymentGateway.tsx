
import React, { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useOrderSystem } from "@/context/OrderSystemContext";

interface PaymentGatewayProps {
  onBack: () => void;
  onComplete: (method: string) => void;
  mobileNumber: string;
  amount: number;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  onBack,
  onComplete,
  mobileNumber,
  amount,
  isProcessing,
  setIsProcessing
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<"method" | "details" | "processing">("method");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      description: "Pay securely with your card"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: <Smartphone className="h-6 w-6 text-custom-green" />,
      description: "Pay using any UPI app"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <ShoppingBag className="h-6 w-6 text-custom-yellow" />,
      description: "Pay when your order arrives"
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    if (methodId === "cod") {
      // For COD, skip the details step
      handlePayment();
    } else {
      setPaymentStep("details");
    }
  };

  const handlePayment = () => {
    setPaymentStep("processing");
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful!");
      onComplete(selectedMethod);
    }, 2000);
  };

  const isFormValid = () => {
    if (selectedMethod === "card") {
      return (
        cardDetails.cardNumber.length === 16 &&
        cardDetails.expiry.length === 5 &&
        cardDetails.cvv.length === 3 &&
        cardDetails.name.length > 3
      );
    }
    return true;
  };

  if (paymentStep === "method") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack} 
            className="flex items-center text-taj-burgundy hover:text-custom-red transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </button>
          <h3 className="text-lg font-medium">Choose Payment Method</h3>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`w-full flex items-center p-4 rounded-lg border ${
                selectedMethod === method.id
                  ? "border-custom-green bg-custom-lightGreen"
                  : "border-gray-300 hover:border-custom-green"
              } transition-all`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                {method.icon}
              </div>
              <div className="text-left">
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (paymentStep === "details") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setPaymentStep("method")} 
            className="flex items-center text-taj-burgundy hover:text-custom-red transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </button>
          <h3 className="text-lg font-medium">
            {selectedMethod === "card" ? "Enter Card Details" : "Complete UPI Payment"}
          </h3>
        </div>
        
        {selectedMethod === "card" ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="space-y-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                maxLength={16}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
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
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    setCardDetails({...cardDetails, expiry: value});
                  }}
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
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
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
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
            
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full p-3 rounded-md font-medium text-white ${
                isFormValid() ? "bg-custom-green hover:bg-custom-green/80" : "bg-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              Pay Securely
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="bg-custom-lightYellow p-4 rounded-lg border border-custom-yellow">
              <p className="text-sm mb-2">Send payment to:</p>
              <p className="font-bold text-lg">upi@restaurant.com</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Open your UPI app and make payment to the above UPI ID.
                Once payment is complete, click the button below to confirm.
              </p>
              
              <button
                onClick={handlePayment}
                className="w-full p-3 bg-custom-green hover:bg-custom-green/80 text-white rounded-md font-medium transition-colors"
              >
                I've Completed the Payment
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin mb-4">
        <div className="h-12 w-12 border-4 border-custom-green border-t-transparent rounded-full"></div>
      </div>
      <p className="text-lg font-medium">Processing your payment...</p>
      <p className="text-sm text-gray-500 mt-2">Please don't close this window.</p>
    </div>
  );
};

export default PaymentGateway;

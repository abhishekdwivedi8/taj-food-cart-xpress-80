
import React, { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { Button } from "@/components/ui/button";

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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="h-6 w-6 text-custom-blue" />,
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

  const sendOtp = () => {
    toast.info(`OTP sent to your mobile number ${mobileNumber}`, {
      description: "Please enter the OTP to complete your payment"
    });
    
    // Simulate OTP sending
    setOtpSent(true);
    
    // For demo purposes, show the OTP in the console
    const demoOtp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`Demo OTP: ${demoOtp}`);
  };

  const handlePayment = () => {
    setPaymentStep("processing");
    setIsProcessing(true);
    
    // Simulate payment processing with a delay
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful!", {
        description: "Your order is confirmed and will be served shortly."
      });
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
    
    if (selectedMethod === "upi" && otpSent) {
      return otp.length === 4;
    }
    
    return true;
  };

  if (paymentStep === "method") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack} 
            className="flex items-center text-custom-red hover:text-custom-red/80 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </button>
          <h3 className="text-lg font-medium text-custom-darkGray">Choose Payment Method</h3>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`w-full flex items-center p-4 rounded-lg border transition-all ${
                selectedMethod === method.id
                  ? "border-custom-green bg-custom-lightGreen shadow-md"
                  : "border-custom-lightGray hover:border-custom-green hover:bg-custom-lightGreen/20"
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
                {method.icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-custom-darkGray">{method.name}</p>
                <p className="text-sm text-custom-darkGray/80">{method.description}</p>
              </div>
              
              <div className="ml-auto">
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "bg-custom-green border-custom-green"
                      : "border-custom-lightGray"
                  }`}
                >
                  {selectedMethod === method.id && (
                    <div className="h-3 w-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (paymentStep === "details") {
    if (selectedMethod === "card") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setPaymentStep("method")} 
              className="flex items-center text-custom-red hover:text-custom-red/80 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </button>
            <h3 className="text-lg font-medium text-custom-darkGray">Enter Card Details</h3>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div className="space-y-2">
              <label htmlFor="cardNumber" className="block text-sm font-medium text-custom-darkGray">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                maxLength={16}
                className="w-full p-2 border border-custom-lightGray rounded-md focus:ring-custom-blue focus:border-custom-blue"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="expiry" className="block text-sm font-medium text-custom-darkGray">Expiry Date</label>
                <input
                  type="text"
                  id="expiry"
                  className="w-full p-2 border border-custom-lightGray rounded-md focus:ring-custom-blue focus:border-custom-blue"
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
                <label htmlFor="cvv" className="block text-sm font-medium text-custom-darkGray">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  className="w-full p-2 border border-custom-lightGray rounded-md focus:ring-custom-blue focus:border-custom-blue"
                  placeholder="123"
                  maxLength={3}
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-custom-darkGray">Name on Card</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-custom-lightGray rounded-md focus:ring-custom-blue focus:border-custom-blue"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full p-3 rounded-md font-medium text-white ${
                isFormValid() ? "bg-custom-green hover:bg-custom-green/80" : "bg-custom-lightGray cursor-not-allowed"
              } transition-colors`}
            >
              Pay Securely
            </Button>
          </form>
        </div>
      );
    } else if (selectedMethod === "upi") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setPaymentStep("method")} 
              className="flex items-center text-custom-red hover:text-custom-red/80 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </button>
            <h3 className="text-lg font-medium text-custom-darkGray">UPI Payment</h3>
          </div>
          
          <div className="bg-custom-lightYellow p-4 rounded-lg border border-custom-yellow">
            <p className="text-custom-darkGray text-sm mb-2">Pay to UPI ID:</p>
            <p className="font-bold text-lg text-custom-darkGray">restaurant@tajflavours</p>
          </div>
          
          {!otpSent ? (
            <div className="space-y-4">
              <p className="text-sm text-custom-darkGray">
                Open your UPI app and scan the QR code or enter the UPI ID to make payment.
                Click the button below to verify your payment.
              </p>
              
              <Button
                onClick={sendOtp}
                className="w-full p-3 bg-custom-blue hover:bg-custom-blue/80 text-white rounded-md font-medium transition-colors"
              >
                Verify Payment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-custom-darkGray mb-2">
                Enter the 4-digit OTP sent to {mobileNumber} for verification.
              </p>
              
              <div className="space-y-2">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="Enter 4-digit OTP"
                  className="w-full p-2 border border-custom-lightGray rounded-md text-center text-lg letter-spacing-wide focus:border-custom-blue focus:ring-custom-blue"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={sendOtp}
                  variant="outline"
                  className="flex-1 border-custom-blue text-custom-blue hover:bg-custom-blue/10"
                >
                  Resend OTP
                </Button>
                
                <Button
                  onClick={handlePayment}
                  disabled={otp.length !== 4}
                  className="flex-1 bg-custom-green hover:bg-custom-green/80 text-white disabled:bg-custom-lightGray"
                >
                  Verify & Pay
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin mb-4">
        <div className="h-12 w-12 border-4 border-custom-green border-t-transparent rounded-full"></div>
      </div>
      <p className="text-lg font-medium text-custom-darkGray">Processing your payment...</p>
      <p className="text-sm text-custom-darkGray/70 mt-2">Please don't close this window.</p>
      
      <div className="mt-6 w-full bg-custom-lightGray rounded-full h-2.5">
        <div className="bg-custom-green h-2.5 rounded-full animate-pulse-slow" style={{width: '70%'}}></div>
      </div>
    </div>
  );
};

export default PaymentGateway;

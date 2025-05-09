
import React, { useEffect } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import confetti from 'canvas-confetti';

const PaymentSuccess: React.FC = () => {
  // Trigger confetti when component mounts
  useEffect(() => {
    // Trigger confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Trigger confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#E53935', '#43A047', '#FFB300'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#E53935', '#43A047', '#FFB300'],
      });
    }, 250);

    // Cleanup function
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 flex flex-col items-center justify-center">
      <div className="relative mb-6">
        <CheckCircle size={72} className="text-custom-green animate-bounce" />
        <div className="absolute inset-0 rounded-full bg-custom-green/20 animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>
      
      <h3 className="text-2xl font-bold text-custom-darkGray mb-3 text-center">
        Payment Successful!
      </h3>
      
      <div className="p-3 bg-custom-lightGreen rounded-lg border border-custom-green/30 mb-4">
        <p className="text-custom-darkGray text-center">
          Thank you for your payment. Your order has been confirmed.
        </p>
      </div>
      
      <div className="space-y-4 w-full">
        {/* Order Status Timeline */}
        <div className="flex items-center text-sm">
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full bg-custom-green flex items-center justify-center text-white">✓</div>
            <div className="h-12 w-0.5 bg-custom-green"></div>
          </div>
          <div className="ml-3">
            <p className="font-medium text-custom-darkGray">Payment Completed</p>
            <p className="text-xs text-custom-darkGray/70">Your payment has been processed successfully</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full bg-custom-yellow flex items-center justify-center text-white">
              <ArrowRight size={14} />
            </div>
            <div className="h-12 w-0.5 bg-custom-yellow/50"></div>
          </div>
          <div className="ml-3">
            <p className="font-medium text-custom-darkGray">Order in Processing</p>
            <p className="text-xs text-custom-darkGray/70">Your order has been sent to the kitchen</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm">
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full bg-custom-lightGray flex items-center justify-center text-custom-darkGray">
              3
            </div>
          </div>
          <div className="ml-3">
            <p className="font-medium text-custom-darkGray">Ready to Serve</p>
            <p className="text-xs text-custom-darkGray/70">Your order will be served to your table shortly</p>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-center text-custom-darkGray/70 mt-4">
        Your order history will be refreshed in a moment.
        <br/>The page will reload automatically.
      </p>
    </div>
  );
};

export default PaymentSuccess;

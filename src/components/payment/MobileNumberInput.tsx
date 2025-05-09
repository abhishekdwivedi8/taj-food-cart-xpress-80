
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Shield } from "lucide-react";

interface MobileNumberInputProps {
  onSubmit: (mobileNumber: string) => void;
  isProcessing: boolean;
}

const MobileNumberInput: React.FC<MobileNumberInputProps> = ({ 
  onSubmit, 
  isProcessing 
}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateMobile = (number: string) => {
    // Simple validation - should be at least 10 digits
    return number.length >= 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateMobile(mobileNumber)) {
      setIsValid(true);
      onSubmit(mobileNumber);
    } else {
      setIsValid(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-custom-lightBlue border border-custom-blue/20 flex items-center gap-3 mb-2">
        <div className="p-2 bg-custom-blue/10 rounded-full">
          <Shield size={18} className="text-custom-blue" />
        </div>
        <div className="text-sm text-custom-darkGray">
          We need your mobile number for order confirmation and delivery updates.
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone size={18} className="mr-2 text-custom-red" />
          <label htmlFor="mobile-number" className="text-sm font-medium text-custom-darkGray">
            Mobile Number
          </label>
        </div>
        <div className="relative">
          <Input
            id="mobile-number"
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(e.target.value.replace(/\D/g, ''));
              if (!isValid) setIsValid(true);
            }}
            className={`${!isValid ? 'border-custom-red ring-custom-red/30' : 'border-custom-lightGray'} bg-white pl-12`}
            disabled={isProcessing}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-darkGray/50">
            +91
          </div>
        </div>
        {!isValid && (
          <p className="text-xs text-custom-red flex items-center gap-1">
            <span className="inline-block h-1 w-1 rounded-full bg-custom-red"></span>
            Please enter a valid 10-digit mobile number
          </p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-custom-green hover:bg-custom-green/90 text-white h-12 font-medium"
        disabled={!mobileNumber || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </form>
  );
};

export default MobileNumberInput;

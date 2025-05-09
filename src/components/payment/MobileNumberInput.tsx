
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <Phone size={18} className="mr-2 text-custom-red" />
          <label htmlFor="mobile-number" className="text-sm font-medium text-gray-700">
            Mobile Number
          </label>
        </div>
        <Input
          id="mobile-number"
          type="tel"
          placeholder="Enter your 10-digit mobile number"
          value={mobileNumber}
          onChange={(e) => {
            setMobileNumber(e.target.value.replace(/\D/g, ''));
            if (!isValid) setIsValid(true);
          }}
          className={`${!isValid ? 'border-custom-red' : ''} bg-white`}
          disabled={isProcessing}
        />
        {!isValid && (
          <p className="text-xs text-custom-red">Please enter a valid mobile number</p>
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

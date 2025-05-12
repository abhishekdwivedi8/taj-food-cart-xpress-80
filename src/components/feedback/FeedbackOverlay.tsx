
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Star, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeviceId } from "@/context/DeviceIdContext";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/utils/formatCurrency";
import { Feedback } from "@/types/feedback";

interface FeedbackOverlayProps {
  onClose: () => void;
  restaurantId: number;
}

/**
 * FeedbackOverlay Component for submitting restaurant feedback
 */
const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ onClose, restaurantId }) => {
  const { deviceId } = useDeviceId();
  const { getOrderHistory, addFeedback } = useOrderSystem();
  const { toast } = useToast();
  const [overallRating, setOverallRating] = useState<number>(0);
  const [foodRating, setFoodRating] = useState<number>(0);
  const [serviceRating, setServiceRating] = useState<number>(0);
  const [ambienceRating, setAmbienceRating] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const orderHistory = getOrderHistory(restaurantId);
  const totalSpent = orderHistory.reduce((sum, order) => sum + order.total, 0);

  const validateForm = () => {
    if (overallRating === 0) {
      setError("Please provide an overall rating.");
      return false;
    }
    
    if (foodRating === 0 && serviceRating === 0 && ambienceRating === 0) {
      setError("Please provide at least one category rating.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Create the feedback object
      const feedbackData: Feedback = {
        id: uuidv4(),
        customerId: deviceId,
        restaurantId,
        date: new Date().toISOString(),
        overall: overallRating,
        food: foodRating,
        service: serviceRating,
        ambience: ambienceRating,
        comments,
        totalSpent,
        orderCount: orderHistory.length
      };

      // Add feedback to order system
      const result = addFeedback(feedbackData);

      if (result) {
        toast({
          title: "Thank you for your feedback!",
          description: "Your reviews help us improve our service.",
          variant: "success" // Now using the success variant we added
        });
        setSubmitSuccess(true);
      } else {
        toast({
          title: "Something went wrong",
          description: "We couldn't submit your feedback. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-xl p-1 transition-colors ${
              star <= value
                ? "text-[#D4AF37]"
                : "text-gray-300 hover:text-[#D4AF37]/50"
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <Star className={`h-6 w-6 ${star <= value ? "fill-[#D4AF37]" : ""}`} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-xl animate-in slide-in-from-bottom duration-300">
        {submitSuccess ? (
          <div className="p-10 text-center space-y-6">
            <div className="text-[#5B0018] flex justify-center">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#5B0018]">Thank You!</h2>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
            <Button 
              onClick={onClose} 
              className="bg-[#5B0018] hover:bg-[#5B0018]/90 text-white"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <CardHeader className="relative bg-[#F5F5DC]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-[#5B0018] text-xl">Rate Your Experience</CardTitle>
              <CardDescription className="text-[#5B0018]/70">
                We value your feedback. Share your thoughts about Taj Flavours.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-medium text-gray-700">Overall Rating</label>
                  <span className="text-sm text-gray-500">
                    {overallRating > 0 ? `${overallRating} stars` : "Not rated yet"}
                  </span>
                </div>
                {renderStarRating(overallRating, setOverallRating)}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Category Ratings</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">Food Quality</label>
                    <div className="flex">
                      {renderStarRating(foodRating, setFoodRating)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">Service</label>
                    <div className="flex">
                      {renderStarRating(serviceRating, setServiceRating)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">Ambience</label>
                    <div className="flex">
                      {renderStarRating(ambienceRating, setAmbienceRating)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-gray-700">Comments</label>
                <Textarea
                  placeholder="Tell us more about your experience..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="resize-none h-24 bg-gray-50"
                />
              </div>

              <div className="bg-[#F5F5DC]/30 p-3 rounded-md border border-[#D4AF37]/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium">{orderHistory.length}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-medium">{formatCurrency(totalSpent)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-2 border-t bg-gray-50">
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={isSubmitting}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#5B0018] hover:bg-[#5B0018]/90"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </span>
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default FeedbackOverlay;

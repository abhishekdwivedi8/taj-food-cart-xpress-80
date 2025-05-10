
import React, { useState, useEffect } from "react";
import { X, ThumbsUp, Star } from "lucide-react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "@/utils/supabaseClient";
import { toast } from "sonner";
import { clearOrderHistory } from "@/utils/orderStorageUtils";
import { clearOrderHistoryCookie } from "@/utils/paymentUtils";

interface FeedbackItemProps {
  item: CartItem;
  onRatingChange: (itemId: string, rating: number) => void;
  onCommentChange: (itemId: string, comment: string) => void;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ 
  item, 
  onRatingChange, 
  onCommentChange 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onRatingChange(item.id, newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    onCommentChange(item.id, e.target.value);
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-center gap-3 mb-3">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.nameEn} className="w-14 h-14 object-cover rounded-md" />
        )}
        <div>
          <h4 className="font-medium text-gray-800">{item.nameEn}</h4>
          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
        </div>
      </div>
      
      <div className="mb-2">
        <p className="text-sm font-medium mb-1">How would you rate this item?</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={24}
                className={`${
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-1">Comments (optional)</p>
        <Textarea
          placeholder="Share your thoughts about this dish..."
          value={comment}
          onChange={handleCommentChange}
          className="h-20 text-sm"
        />
      </div>
    </div>
  );
};

interface FeedbackOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  orderedItems: CartItem[];
  restaurantId: number;
  orderId: string;
  customerId: string;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  isOpen,
  onClose,
  orderedItems,
  restaurantId,
  orderId,
  customerId
}) => {
  const [itemRatings, setItemRatings] = useState<{[key: string]: number}>({});
  const [itemComments, setItemComments] = useState<{[key: string]: string}>({});
  const [overallRating, setOverallRating] = useState<number>(0);
  const [overallComment, setOverallComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleItemRatingChange = (itemId: string, rating: number) => {
    setItemRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleItemCommentChange = (itemId: string, comment: string) => {
    setItemComments(prev => ({ ...prev, [itemId]: comment }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit individual item feedback
      for (const itemId in itemRatings) {
        const rating = itemRatings[itemId];
        const comment = itemComments[itemId] || "";
        
        // Save to database
        await supabaseClient
          .from('reviews')
          .insert({
            item_id: itemId,
            order_id: orderId,
            restaurant_id: restaurantId,
            customer_id: customerId,
            rating,
            comment,
            created_at: new Date().toISOString()
          });
      }
      
      // Submit overall restaurant experience
      if (overallRating > 0) {
        await supabaseClient
          .from('restaurant_reviews')
          .insert({
            restaurant_id: restaurantId,
            order_id: orderId,
            customer_id: customerId,
            rating: overallRating,
            comment: overallComment,
            created_at: new Date().toISOString()
          });
      }
      
      toast.success("Thank you for your feedback!");
      
      // Clear order history after successful submission
      setTimeout(() => {
        clearOrderHistory();
        clearOrderHistoryCookie();
        window.location.reload();
      }, 2000);
      
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Rate Your Order</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-lg mb-4">Food Items</h4>
            {orderedItems.map((item) => (
              <FeedbackItem 
                key={item.id}
                item={item}
                onRatingChange={handleItemRatingChange}
                onCommentChange={handleItemCommentChange}
              />
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-lg mb-3">Overall Experience</h4>
            <p className="text-sm mb-2">How was your overall experience with the restaurant?</p>
            
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`${
                      star <= overallRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <Textarea
              placeholder="Any additional comments about your experience..."
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(itemRatings).length === 0}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackOverlay;

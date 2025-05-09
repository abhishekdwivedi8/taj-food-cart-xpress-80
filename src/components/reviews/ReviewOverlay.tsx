
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, ThumbsUp } from "lucide-react";
import { CartItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabaseClient } from "@/utils/supabaseClient";

interface ReviewItemProps {
  item: CartItem;
  onRate: (itemId: string, rating: number, comment: string) => void;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ item, onRate }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    onRate(item.id, rating, comment);
    setIsSubmitted(true);
  };

  return (
    <div className={`p-4 border-b ${isSubmitted ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-3 mb-3">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.nameEn} className="w-12 h-12 object-cover rounded" />
        )}
        <h3 className="font-medium text-restaurant-primary">{item.nameEn}</h3>
      </div>
      
      {!isSubmitted ? (
        <>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                } focus:outline-none hover:scale-110 transition-transform`}
              >
                ★
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your thoughts about this dish..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3 h-20"
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-restaurant-primary text-white"
          >
            Submit Review
          </Button>
        </>
      ) : (
        <div className="flex items-center justify-center py-4 text-green-600">
          <ThumbsUp className="mr-2" size={18} />
          <span>Thank you for your review!</span>
        </div>
      )}
    </div>
  );
};

interface ReviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderId: string;
  restaurantId: number;
  customerId: string;
  onOutsideClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ReviewOverlay: React.FC<ReviewOverlayProps> = ({
  isOpen,
  onClose,
  items,
  orderId,
  restaurantId,
  customerId,
  onOutsideClick
}) => {
  const { toast } = useToast();
  const [submittedCount, setSubmittedCount] = useState(0);

  const handleRateItem = async (itemId: string, rating: number, comment: string) => {
    try {
      // Insert into Supabase
      const { error } = await supabaseClient
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

      if (error) throw error;
      
      setSubmittedCount(prev => prev + 1);
      
      // If all items have been reviewed, close the overlay after a delay
      if (submittedCount + 1 >= items.length) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onOutsideClick}
    >
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in card-gradient">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-restaurant-primary text-white z-10">
          <h2 className="text-xl font-semibold font-serif">Share Your Feedback (Optional)</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-restaurant-primary/80"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="divide-y">
          {items.map((item) => (
            <ReviewItem 
              key={item.id} 
              item={item} 
              onRate={handleRateItem} 
            />
          ))}
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <div className="text-gray-500 text-sm">
            Your feedback helps us improve our menu and service!
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-white/50 hover:bg-white"
          >
            Skip Review
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReviewOverlay;


import React, { useEffect, useState } from "react";
import { getItemAverageRating } from "@/utils/supabaseClient";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  itemId: string;
  size?: "small" | "medium" | "large";
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ itemId, size = "medium" }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      setIsLoading(true);
      try {
        const avgRating = await getItemAverageRating(itemId);
        console.log(`Rating for item ${itemId}:`, avgRating);
        setRating(avgRating);
      } catch (error) {
        console.error(`Error fetching rating for item ${itemId}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();
  }, [itemId]);

  if (isLoading) {
    return <div className="flex items-center h-6 opacity-60 text-xs">Loading...</div>;
  }

  if (rating === null) {
    return <div className="text-custom-darkGray/60 text-xs">No ratings yet</div>;
  }

  const starSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  const iconSizes = {
    small: 12,
    medium: 16,
    large: 20
  };

  return (
    <div className="flex items-center">
      <div className={`flex ${starSizes[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const halfFilled = !filled && star === Math.ceil(rating) && rating % 1 >= 0.3;
          
          return (
            <Star
              key={star}
              size={iconSizes[size]} 
              className={`${
                filled 
                  ? "text-yellow-400 fill-yellow-400" 
                  : halfFilled
                  ? "text-yellow-400 fill-yellow-400/50"
                  : "text-gray-300"
              }`}
            />
          );
        })}
      </div>
      <span className={`ml-1 text-custom-darkGray ${starSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingDisplay;

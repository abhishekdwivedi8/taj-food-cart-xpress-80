
import React, { useEffect, useState } from "react";
import { getItemAverageRating } from "@/utils/supabaseClient";

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
      const avgRating = await getItemAverageRating(itemId);
      setRating(avgRating);
      setIsLoading(false);
    };

    fetchRating();
  }, [itemId]);

  if (isLoading) {
    return <div className="flex items-center h-6 opacity-60">Loading rating...</div>;
  }

  if (rating === null) {
    return <div className="text-custom-darkGray/60 text-sm">No ratings yet</div>;
  }

  const starSizes = {
    small: "text-sm",
    medium: "text-md",
    large: "text-lg"
  };

  return (
    <div className="flex items-center">
      <div className={`flex ${starSizes[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const difference = rating - star + 1;
          
          return (
            <span 
              key={star} 
              className={`${
                difference > 0
                  ? difference >= 1
                    ? "text-custom-yellow" // full star
                    : "text-gradient-star" // half star
                  : "text-gray-300" // empty star
              }`}
            >
              ★
            </span>
          );
        })}
      </div>
      <span className="ml-1 text-custom-darkGray text-sm">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingDisplay;

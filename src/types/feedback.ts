
export interface ReviewItem {
  id?: string;
  item_id: string;
  order_id: string;
  restaurant_id: number;
  customer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface RestaurantReview {
  id?: string;
  restaurant_id: number;
  order_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface FeedbackStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MessageSquare, Star, 
  ThumbsUp, ThumbsDown, Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import { supabaseClient } from "@/utils/supabaseClient";
import { menuItems } from "@/data/menuItems";

interface Review {
  id: string;
  item_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  restaurant_id: number;
  order_id: string;
}

interface MenuItemWithReviews {
  id: string;
  nameEn: string;
  category: string;
  imageUrl?: string;
  image?: string;
  avgRating: number;
  reviewCount: number;
  recentReviews: Review[];
}

const ReviewsManagementPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<MenuItemWithReviews[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [managerResponse, setManagerResponse] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Fetch all reviews
        const { data: reviews, error } = await supabaseClient
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Process reviews by menu item
        const itemMap = new Map<string, {
          reviews: Review[], 
          totalRating: number,
          item: any
        }>();

        // Group reviews by item
        if (reviews) {
          reviews.forEach((review: Review) => {
            const item = menuItems.find(i => i.id === review.item_id);
            if (!item) return;
            
            if (!itemMap.has(review.item_id)) {
              itemMap.set(review.item_id, {
                reviews: [],
                totalRating: 0,
                item
              });
            }
            
            const itemData = itemMap.get(review.item_id)!;
            itemData.reviews.push(review);
            itemData.totalRating += review.rating;
          });
        }

        // Create items with reviews
        const itemsWithReviews: MenuItemWithReviews[] = Array.from(itemMap.entries()).map(([id, data]) => {
          const avgRating = data.reviews.length > 0 
            ? data.totalRating / data.reviews.length 
            : 0;
          
          return {
            id,
            nameEn: data.item.nameEn,
            category: data.item.category,
            imageUrl: data.item.imageUrl || data.item.image,
            image: data.item.image,
            avgRating,
            reviewCount: data.reviews.length,
            recentReviews: data.reviews.slice(0, 5)
          };
        }).sort((a, b) => b.avgRating - a.avgRating);

        setItems(itemsWithReviews);

        // Get the most recent 10 reviews for the dashboard
        const allReviews = reviews ? 
          [...reviews].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 10) : [];
          
        setRecentReviews(allReviews);
        
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter items by category and rating
  const filteredItems = items
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .filter(item => ratingFilter === null || 
      (Math.floor(item.avgRating) === ratingFilter || 
       (item.avgRating >= 4.5 && ratingFilter === 5)));

  const categories = ["all", ...new Set(items.map(item => item.category))];

  // Handle sending a response to a review
  const handleSendResponse = async () => {
    if (!selectedReview || !managerResponse) return;
    
    try {
      // Here you would save the manager response to Supabase
      const { error } = await supabaseClient
        .from('manager_responses')
        .insert({
          review_id: selectedReview.id,
          response: managerResponse,
          manager_id: 'system', // Replace with actual manager ID when auth is implemented
        });
        
      if (error) throw error;
      
      // Reset form
      setManagerResponse("");
      setSelectedReview(null);
      
      // Provide feedback
      alert("Response sent successfully");
      
    } catch (error) {
      console.error("Error sending response:", error);
      alert("Failed to send response. Please try again.");
    }
  };

  // Get stars for rating display
  const ratingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-600"
              onClick={() => navigate('/manager')}
            >
              <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-restaurant-primary">
              Reviews Management
            </h1>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Total Reviews</h3>
                  <MessageSquare size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {items.reduce((acc, item) => acc + item.reviewCount, 0)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Average Rating</h3>
                  <Star size={20} className="text-yellow-400" />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {items.length > 0 
                    ? (items.reduce((acc, item) => acc + (item.avgRating * item.reviewCount), 0) / 
                       items.reduce((acc, item) => acc + item.reviewCount, 0)).toFixed(1)
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Top Rated</h3>
                  <ThumbsUp size={20} className="text-green-500" />
                </div>
                <p className="text-lg font-bold mt-2 truncate">
                  {items.length > 0 
                    ? items.slice().sort((a, b) => b.avgRating - a.avgRating)[0].nameEn
                    : "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent Reviews */}
        <Card className="mb-8">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="font-semibold text-lg text-gray-800">Recent Reviews</h2>
          </div>
          <CardContent className="p-0">
            {recentReviews.length > 0 ? (
              <div className="divide-y">
                {recentReviews.map((review) => {
                  const item = menuItems.find(i => i.id === review.item_id);
                  if (!item) return null;
                  
                  return (
                    <div key={review.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl || item.image} 
                            alt={item.nameEn} 
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.nameEn}</h4>
                            <div className="flex">
                              {ratingStars(review.rating)}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {review.comment || "No comment provided"}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedReview(review)}
                              className="text-xs text-blue-600 hover:bg-blue-50"
                            >
                              Respond
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No recent reviews available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Items with Reviews */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Menu Items Reviews</h2>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter size={16} />
                  {ratingFilter ? `${ratingFilter} Stars` : "Filter by Rating"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <div 
                    className="cursor-pointer p-2 rounded hover:bg-gray-100"
                    onClick={() => setRatingFilter(null)}
                  >
                    All Ratings
                  </div>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div 
                      key={rating}
                      className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                        ratingFilter === rating ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setRatingFilter(rating)}
                    >
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-1">
                          {Array(rating).fill(0).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {Array(5-rating).fill(0).map((_, i) => (
                            <span key={i} className="text-gray-300">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs 
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize px-5"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Loading reviews...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No items found with the selected filters
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={item.imageUrl || "/placeholder.svg"} 
                    alt={item.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {item.nameEn}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <span 
                              key={i} 
                              className={i < Math.round(item.avgRating) ? "text-yellow-400" : "text-white/50"}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm">
                          ({item.avgRating.toFixed(1)}) • {item.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-0 divide-y">
                  {item.recentReviews.length > 0 ? (
                    item.recentReviews.map((review) => (
                      <HoverCard key={review.id}>
                        <HoverCardTrigger asChild>
                          <div className="p-3 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">
                                {review.customer_id.substring(0, 6)}...
                              </span>
                              <div className="flex text-yellow-400 text-sm">
                                {ratingStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-sm line-clamp-2 text-gray-700">
                              {review.comment || "No comment provided"}
                            </p>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                Customer Review
                              </span>
                              <div className="flex text-yellow-400">
                                {ratingStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">
                              {review.comment || "No comment provided"}
                            </p>
                            <div className="text-xs text-gray-500">
                              Submitted on {new Date(review.created_at).toLocaleDateString()}
                            </div>
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedReview(review)}
                              >
                                Respond to Review
                              </Button>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No reviews available
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <Card className="w-full max-w-lg">
            <div className="p-4 border-b bg-restaurant-primary text-white flex justify-between items-center">
              <h2 className="font-medium">
                Respond to Customer Review
              </h2>
              <Button 
                variant="ghost"
                size="icon"
                className="text-white hover:bg-restaurant-primary/90"
                onClick={() => setSelectedReview(null)}
              >
                <X size={18} />
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="font-medium mb-1">
                  Customer's Review:
                </h3>
                <div className="flex mb-2 text-yellow-400">
                  {ratingStars(selectedReview.rating)}
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {selectedReview.comment || "No comment provided"}
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Your Response:
                </label>
                <Textarea
                  value={managerResponse}
                  onChange={(e) => setManagerResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline"
                  className="mr-2"
                  onClick={() => setSelectedReview(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendResponse}
                  disabled={!managerResponse}
                >
                  Send Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagementPage;

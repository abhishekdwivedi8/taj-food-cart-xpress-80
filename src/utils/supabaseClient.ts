
import { createClient } from '@supabase/supabase-js';

// Default values in case environment variables are not set
// These will prevent the app from crashing during development or when env vars aren't available
const DEFAULT_SUPABASE_URL = 'https://your-supabase-project.supabase.co';
const DEFAULT_SUPABASE_KEY = 'public-anon-key';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Create Supabase client only if URL is properly defined
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Function to get average rating for a menu item
export async function getItemAverageRating(itemId: string) {
  try {
    console.log("Fetching rating for item:", itemId);
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('rating')
      .eq('item_id', itemId);
    
    if (error) {
      console.error("Error fetching ratings:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No ratings found for item:", itemId);
      return null;
    }
    
    // Calculate average
    const sum = data.reduce((total, review) => total + review.rating, 0);
    const average = sum / data.length;
    console.log(`Average rating for ${itemId}:`, average, `(${data.length} reviews)`);
    return average;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }
}

// Function to get all reviews for a specific restaurant
export async function getRestaurantReviews(restaurantId: number) {
  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching restaurant reviews:", error);
    return [];
  }
}

// Function to get reviews for a specific menu item
export async function getItemReviews(itemId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching item reviews:", error);
    return [];
  }
}

// Function to save order details to database
export async function saveOrderToDatabase(order: any) {
  try {
    const { error } = await supabaseClient
      .from('orders')
      .insert(order);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving order:", error);
    return false;
  }
}

// Function to save manager response to a review
export async function saveManagerResponse(reviewId: string, response: string, managerId: string) {
  try {
    const { error } = await supabaseClient
      .from('manager_responses')
      .insert({
        review_id: reviewId,
        response: response,
        manager_id: managerId,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving manager response:", error);
    return false;
  }
}

// Function to get all manager responses for a specific restaurant
export async function getManagerResponses(restaurantId: number) {
  try {
    const { data, error } = await supabaseClient
      .from('manager_responses')
      .select(`
        *,
        reviews!inner(restaurant_id)
      `)
      .eq('reviews.restaurant_id', restaurantId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching manager responses:", error);
    return [];
  }
}

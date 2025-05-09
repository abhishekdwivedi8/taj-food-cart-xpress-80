
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Function to get average rating for a menu item
export async function getItemAverageRating(itemId: string) {
  try {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('rating')
      .eq('item_id', itemId);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Calculate average
    const sum = data.reduce((total, review) => total + review.rating, 0);
    return sum / data.length;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return null;
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

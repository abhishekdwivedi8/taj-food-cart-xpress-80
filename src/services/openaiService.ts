import { WeatherData, FoodRecommendation, MenuItem } from "@/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface GPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const getAIFoodRecommendations = async (
  weatherData: WeatherData,
  availableItems: MenuItem[]
): Promise<FoodRecommendation[]> => {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("OpenAI API key is not available");
      // Return a fallback recommendation based on weather without API call
      return createFallbackRecommendations(weatherData, availableItems);
    }

    const { temperature, condition, humidity } = weatherData;
    
    // Prepare categories for available items to help with recommendations
    const categories = Array.from(new Set(availableItems.map(item => item.category)));
    const vegItems = availableItems.filter(item => item.isVeg).length;
    const nonVegItems = availableItems.filter(item => !item.isVeg).length;
    const spicyItems = availableItems.filter(item => item.isSpicy).length;
    
    // Create a system prompt for the AI with more detailed weather information
    const systemPrompt = `You are a culinary expert and food recommender for an Indian restaurant.
    Based on the current weather conditions, recommend appropriate Indian food items from the available menu.
    Weather: Temperature ${temperature}°C, Condition: ${condition}, Humidity: ${humidity}%.
    Available categories: ${categories.join(", ")}.
    We have ${vegItems} vegetarian items, ${nonVegItems} non-vegetarian items, and ${spicyItems} spicy items.
    Consider that people prefer refreshing items in hot weather, warming items in cold weather, 
    comfort food during rainy weather, and lighter options when it's sunny.`;
    
    // User prompt that requests specific recommendation format
    const userPrompt = `Give me food recommendations based on the current weather (${temperature}°C, ${condition}, ${humidity}% humidity).
    Return your answer in JSON format only, with this structure:
    {
      "type": "cold-weather|hot-weather|rainy-weather|sunny-weather|default",
      "reason": "Brief explanation why these foods are recommended for this weather",
      "itemIds": ["id-1", "id-2", "id-3", "id-4", "id-5"]
    }
    Only include IDs from this list: ${availableItems.map(item => item.id).join(", ")}
    Limit to 5 items maximum.`;

    // Make API request to OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return createFallbackRecommendations(weatherData, availableItems);
    }

    const data = await response.json() as GPTResponse;
    const contentStr = data.choices[0]?.message?.content || "{}";
    
    // Parse the JSON response
    let recommendationData;
    try {
      recommendationData = JSON.parse(contentStr);
    } catch (e) {
      console.error("Failed to parse OpenAI response:", e);
      return createFallbackRecommendations(weatherData, availableItems);
    }
    
    // Find the recommended items by ID
    const recommendedItems = availableItems.filter(item => 
      recommendationData.itemIds.includes(item.id)
    );
    
    // Create the recommendation object
    const recommendation: FoodRecommendation = {
      type: recommendationData.type || "default",
      items: recommendedItems,
      reason: recommendationData.reason || `${condition} weather food recommendations`
    };
    
    return [recommendation];
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return createFallbackRecommendations(weatherData, availableItems);
  }
};

// Fallback function when OpenAI API is unavailable or fails - with more detailed weather-based logic
const createFallbackRecommendations = (
  weatherData: WeatherData,
  availableItems: MenuItem[]
): FoodRecommendation[] => {
  const { temperature, condition, humidity } = weatherData;
  
  // Create different recommendations based on weather conditions
  if (temperature < 15 || condition === 'cold') {
    // Hot soups, warm dishes for cold weather
    const items = availableItems.filter(item => 
      item.description?.toLowerCase().includes('soup') ||
      item.description?.toLowerCase().includes('warm') ||
      item.description?.toLowerCase().includes('hot') ||
      item.nameEn.toLowerCase().includes('curry') ||
      item.isSpicy
    ).slice(0, 5);
    
    return [{
      type: 'cold-weather',
      items,
      reason: `It's ${Math.round(temperature)}°C outside! Try these warming dishes:`
    }];
  } 
  else if (temperature > 25 || condition === 'hot') {
    // Cold drinks, refreshing dishes for hot weather
    const items = availableItems.filter(item => 
      item.category === 'drinks' ||
      item.description?.toLowerCase().includes('cold') ||
      item.description?.toLowerCase().includes('refreshing') ||
      item.description?.toLowerCase().includes('yogurt')
    ).slice(0, 5);
    
    return [{
      type: 'hot-weather',
      items,
      reason: `Beat the heat (${Math.round(temperature)}°C) with these refreshing options:`
    }];
  }
  else if (condition === 'rainy') {
    // Comfort food for rainy weather
    const items = availableItems.filter(item => 
      item.description?.toLowerCase().includes('comfort') ||
      item.category === 'appetizers' ||
      item.nameEn.toLowerCase().includes('pakora') ||
      item.nameEn.toLowerCase().includes('bhaji')
    ).slice(0, 5);
    
    return [{
      type: 'rainy-weather',
      items,
      reason: 'Perfect comfort foods for this rainy day:'
    }];
  }
  else if (condition === 'sunny') {
    // Lighter options for sunny weather
    const items = availableItems.filter(item => 
      item.isVeg ||
      item.description?.toLowerCase().includes('light') ||
      item.description?.toLowerCase().includes('fresh')
    ).slice(0, 5);
    
    return [{
      type: 'hot-weather',
      items,
      reason: 'Enjoy these lighter dishes on this beautiful sunny day:'
    }];
  }
  
  // Default recommendations
  const popularItems = availableItems
    .filter(item => item.isPopular)
    .slice(0, 5);
  
  return [{
    type: 'default',
    items: popularItems.length ? popularItems : availableItems.slice(0, 5),
    reason: 'Our chef recommendations for today:'
  }];
};

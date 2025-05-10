
import { WeatherData } from "@/types";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "demo_key";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherData = async (
  latitude?: number,
  longitude?: number
): Promise<WeatherData> => {
  try {
    // Default to a location if geolocation fails (New York as fallback)
    const lat = latitude || 40.7128;
    const lon = longitude || -74.0060;
    
    // If we're using the demo key, return mock data to avoid API errors
    if (WEATHER_API_KEY === "demo_key") {
      return getMockWeatherData();
    }

    const response = await fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Weather data fetch failed");
    }

    const data = await response.json();
    
    // Map the OpenWeatherMap API response to our WeatherData type
    const weatherData: WeatherData = {
      temperature: data.main.temp,
      condition: mapWeatherCondition(data.weather[0].main),
      humidity: data.main.humidity,
      icon: data.weather[0].icon
    };

    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return getMockWeatherData();
  }
};

// Helper function to map OpenWeatherMap conditions to our simplified conditions
function mapWeatherCondition(condition: string): string {
  const lowercaseCondition = condition.toLowerCase();
  
  if (lowercaseCondition.includes('rain') || lowercaseCondition.includes('drizzle')) {
    return 'rainy';
  } else if (lowercaseCondition.includes('snow')) {
    return 'cold';
  } else if (lowercaseCondition.includes('clear')) {
    return 'sunny';
  } else if (lowercaseCondition.includes('clouds')) {
    return 'cloudy';
  } else if (lowercaseCondition.includes('thunderstorm')) {
    return 'rainy';
  } else {
    return 'sunny'; // Default
  }
}

// Mock weather data generator for development/fallback
function getMockWeatherData(): WeatherData {
  const conditions = ['sunny', 'rainy', 'cloudy', 'hot', 'cold'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // Temperature based on condition
  let temp = 22;
  if (randomCondition === 'hot') temp = 32;
  if (randomCondition === 'cold') temp = 10;
  
  return {
    temperature: temp,
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
    icon: ''
  };
}

// Function to get user's location
export const getUserLocation = (): Promise<{latitude: number, longitude: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        reject(error);
      }
    );
  });
};

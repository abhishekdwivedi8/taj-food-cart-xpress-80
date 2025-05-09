
import React, { useState, useEffect } from "react";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuItems } from "@/data/menuItems";
import AvailabilityTag from "@/components/AvailabilityTag";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";
import { MenuItem, CartItem, WeatherData, FoodRecommendation } from "@/types";
import MenuItemCard from "@/components/MenuItemCard";
import { Thermometer, Cloud, CloudRain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MenuSectionProps {
  restaurantId: number;
}

const CATEGORIES = ["appetizers", "mains", "sides", "drinks", "desserts"];

const MenuSection: React.FC<MenuSectionProps> = ({ restaurantId }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const { addToCart } = useOrderSystem();

  // Filter menu items for this restaurant
  const restaurantMenu = menuItems.filter(
    (item) => !item.restaurantId || item.restaurantId === restaurantId
  );

  // Further filter by category if a specific one is selected
  const displayedItems =
    selectedCategory === "all"
      ? restaurantMenu
      : restaurantMenu.filter((item) => item.category === selectedCategory);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using OpenWeatherMap free API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=bd5e378503939ddaee76f12ad7a97608`
        );
        const data = await response.json();
        
        // Create weather data object
        const weatherData: WeatherData = {
          temperature: data.main.temp,
          condition: data.weather[0].main.toLowerCase(),
          humidity: data.main.humidity,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        };
        
        setWeather(weatherData);
        generateRecommendations(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // Fallback to mock weather if API fails
        const mockWeather = {
          temperature: 22,
          condition: "clear",
          humidity: 65,
          icon: ''
        };
        setWeather(mockWeather);
        generateRecommendations(mockWeather);
      }
    };

    fetchWeather();
  }, [restaurantId]);

  // Generate food recommendations based on weather
  const generateRecommendations = (weatherData: WeatherData) => {
    const { temperature, condition } = weatherData;
    let starterItems: MenuItem[] = [];
    let mainItems: MenuItem[] = [];
    let dessertItems: MenuItem[] = [];

    // Filter available items only
    const availableItems = restaurantMenu.filter(item => isMenuItemAvailable(item.id));

    // Starters recommendation logic
    if (temperature < 15) {
      // Cold weather - recommend soups and warm starters
      starterItems = availableItems.filter(
        item => item.category === "appetizers" && 
                (item.nameEn.toLowerCase().includes('soup') || 
                 item.description?.toLowerCase().includes('warm') ||
                 item.description?.toLowerCase().includes('hot'))
      ).slice(0, 3);
    } else if (condition.includes('rain')) {
      // Rainy weather - comfort food starters
      starterItems = availableItems.filter(
        item => item.category === "appetizers" && 
                (item.description?.toLowerCase().includes('comfort') || 
                 item.description?.toLowerCase().includes('crispy'))
      ).slice(0, 3);
    } else {
      // Good weather - refreshing starters
      starterItems = availableItems.filter(
        item => item.category === "appetizers" && 
                (item.description?.toLowerCase().includes('fresh') || 
                 item.description?.toLowerCase().includes('light'))
      ).slice(0, 3);
    }

    // Main dishes recommendation logic
    if (temperature < 15) {
      // Cold weather - warm, heavy main dishes
      mainItems = availableItems.filter(
        item => item.category === "mains" && 
                (item.description?.toLowerCase().includes('hearty') || 
                 item.description?.toLowerCase().includes('rich') ||
                 item.description?.toLowerCase().includes('warm'))
      ).slice(0, 3);
    } else if (condition.includes('rain')) {
      // Rainy weather - comfort main dishes
      mainItems = availableItems.filter(
        item => item.category === "mains" && 
                (item.description?.toLowerCase().includes('comfort') || 
                 item.description?.toLowerCase().includes('traditional'))
      ).slice(0, 3);
    } else {
      // Good weather - lighter main dishes
      mainItems = availableItems.filter(
        item => item.category === "mains" && 
                (item.description?.toLowerCase().includes('seasonal') || 
                 item.description?.toLowerCase().includes('light') ||
                 item.description?.toLowerCase().includes('fresh'))
      ).slice(0, 3);
    }

    // Dessert recommendation logic
    if (temperature < 15) {
      // Cold weather - warm desserts
      dessertItems = availableItems.filter(
        item => item.category === "desserts" && 
                (item.description?.toLowerCase().includes('warm') || 
                 item.description?.toLowerCase().includes('hot'))
      ).slice(0, 3);
    } else if (temperature > 25) {
      // Hot weather - cold desserts
      dessertItems = availableItems.filter(
        item => item.category === "desserts" && 
                (item.description?.toLowerCase().includes('cold') || 
                 item.description?.toLowerCase().includes('ice') ||
                 item.description?.toLowerCase().includes('refreshing'))
      ).slice(0, 3);
    } else {
      // Moderate weather - any dessert
      dessertItems = availableItems.filter(item => item.category === "desserts").slice(0, 3);
    }

    // If we don't have enough items in any category, fill with available items
    if (starterItems.length < 2) {
      const additionalStarterItems = availableItems.filter(
        item => item.category === "appetizers" && !starterItems.some(i => i.id === item.id)
      ).slice(0, 3 - starterItems.length);
      starterItems = [...starterItems, ...additionalStarterItems];
    }

    if (mainItems.length < 2) {
      const additionalMainItems = availableItems.filter(
        item => item.category === "mains" && !mainItems.some(i => i.id === item.id)
      ).slice(0, 3 - mainItems.length);
      mainItems = [...mainItems, ...additionalMainItems];
    }

    if (dessertItems.length < 2) {
      const additionalDessertItems = availableItems.filter(
        item => item.category === "desserts" && !dessertItems.some(i => i.id === item.id)
      ).slice(0, 3 - dessertItems.length);
      dessertItems = [...dessertItems, ...additionalDessertItems];
    }

    setRecommendations([
      { type: 'starter', items: starterItems, reason: '' },
      { type: 'main', items: mainItems, reason: '' },
      { type: 'dessert', items: dessertItems, reason: '' }
    ]);
  };

  // Weather display component
  const WeatherDisplay = () => {
    if (!weather) return null;

    return (
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm flex items-center mb-6">
        {weather.condition.includes('cloud') ? (
          <Cloud className="h-6 w-6 text-blue-500 mr-3" />
        ) : weather.condition.includes('rain') ? (
          <CloudRain className="h-6 w-6 text-blue-500 mr-3" />
        ) : (
          <Thermometer className="h-6 w-6 text-orange-500 mr-3" />
        )}
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-700">Today's Weather</h3>
          <p className="text-sm text-gray-600">
            {Math.round(weather.temperature)}°C, {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowRecommendations(!showRecommendations)}
        >
          {showRecommendations ? "Hide Suggestions" : "Show Suggestions"}
        </Button>
      </div>
    );
  };

  // Recommendations section
  const RecommendationSection = () => {
    if (!showRecommendations || recommendations.length === 0) return null;

    return (
      <div className="mb-8 space-y-6">
        <h3 className="text-xl font-semibold text-center">Weather-Based Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.flatMap(section => section.items).map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurantId}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Menu</h2>
      
      <WeatherDisplay />
      
      <RecommendationSection />

      {/* Category Navigation */}
      <div className="mb-8">
        <Tabs
          defaultValue="all"
          className="w-full"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="px-5">
              All
            </TabsTrigger>
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category} className="px-5 capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            restaurantId={restaurantId}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;

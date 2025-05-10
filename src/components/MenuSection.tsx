import React, { useState, useEffect } from "react";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuItems } from "@/data/menuItems";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";
import { MenuItem, CartItem, WeatherData, FoodRecommendation } from "@/types";
import MenuItemCard from "@/components/MenuItemCard";
import { Thermometer, Cloud, CloudRain, ArrowUp, ArrowDown, Filter, CloudSun, Umbrella, Snowflake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getAIFoodRecommendations } from "@/services/openaiService";
import { toast } from "sonner";
import { getWeatherData, getUserLocation } from "@/services/weatherService";

interface MenuSectionProps {
  restaurantId: number;
}

const CATEGORIES = ["appetizers", "mains", "sides", "drinks", "desserts"];

const MenuSection: React.FC<MenuSectionProps> = ({ restaurantId }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular">("popular");
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 1000]);
  const [dietaryFilter, setDietaryFilter] = useState<{veg: boolean, spicy: boolean}>({ veg: false, spicy: false });
  
  const { addToCart } = useOrderSystem();

  // Filter menu items for this restaurant
  const restaurantMenu = menuItems.filter(
    (item) => !item.restaurantId || item.restaurantId === restaurantId
  );

  // Apply search filter
  const searchFilteredItems = restaurantMenu.filter(item => 
    item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.nameHi && item.nameHi.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Apply category filter
  const categoryFilteredItems = selectedCategory === "all"
    ? searchFilteredItems
    : searchFilteredItems.filter((item) => item.category === selectedCategory);
    
  // Apply price filter
  const priceFilteredItems = categoryFilteredItems.filter(item => {
    const finalPrice = getDiscountedPrice(item);
    return finalPrice >= priceFilter[0] && finalPrice <= priceFilter[1];
  });
  
  // Apply dietary filter
  const dietaryFilteredItems = priceFilteredItems.filter(item => {
    if (dietaryFilter.veg && !item.isVeg) return false;
    if (dietaryFilter.spicy && !item.isSpicy) return false;
    return true;
  });
  
  // Apply sorting
  const sortedItems = [...dietaryFilteredItems].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return getDiscountedPrice(a) - getDiscountedPrice(b);
      case "price-desc":
        return getDiscountedPrice(b) - getDiscountedPrice(a);
      case "name-asc":
        return a.nameEn.localeCompare(b.nameEn);
      case "name-desc":
        return b.nameEn.localeCompare(a.nameEn);
      case "popular":
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      default:
        return 0;
    }
  });
  
  const displayedItems = sortedItems;

  // Find the price range for the current category
  const minPrice = Math.min(...restaurantMenu.map(item => getDiscountedPrice(item)));
  const maxPrice = Math.max(...restaurantMenu.map(item => getDiscountedPrice(item)));

  // Fetch weather data and get AI recommendations
  useEffect(() => {
    const fetchWeatherAndRecommendations = async () => {
      setIsLoading(true);
      try {
        let userLocation;
        try {
          // Try to get user location
          userLocation = await getUserLocation();
        } catch (error) {
          console.log("Could not get user location, using default");
        }
        
        // Get real weather data using the location (if available)
        const weatherData = await getWeatherData(
          userLocation?.latitude,
          userLocation?.longitude
        );
        
        setWeather(weatherData);
        
        // Get AI-powered food recommendations
        const availableItems = restaurantMenu.filter(item => isMenuItemAvailable(item.id));
        toast.info("Getting personalized recommendations based on weather...");
        
        const aiRecommendations = await getAIFoodRecommendations(weatherData, availableItems);
        setRecommendations(aiRecommendations);
        
        // Show success toast when recommendations are ready
        toast.success("Weather-based recommendations ready!");
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to basic weather
        const mockWeather = {
          temperature: 22,
          condition: 'sunny',
          humidity: 65,
          icon: ''
        };
        setWeather(mockWeather);
        
        // Generate basic recommendations
        const availableItems = restaurantMenu.filter(item => isMenuItemAvailable(item.id));
        const popularItems = availableItems.filter(item => item.isPopular).slice(0, 6);
        
        setRecommendations([{
          type: 'default',
          items: popularItems,
          reason: 'Our chef recommendations for today:'
        }]);
        
        toast.error("Couldn't get personalized recommendations, showing our popular items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherAndRecommendations();
  }, [restaurantId]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortOption("popular");
    setPriceFilter([minPrice, maxPrice]);
    setDietaryFilter({ veg: false, spicy: false });
  };

  // Weather display component
  const WeatherDisplay = () => {
    if (isLoading) {
      return (
        <div className="p-3 rounded-lg bg-gradient-to-r from-custom-lightYellow to-custom-lightYellow/50 shadow-sm flex items-center justify-center mb-6">
          <div className="h-5 w-5 border-2 border-custom-red border-t-transparent rounded-full animate-spin mr-3"></div>
          <p>Getting today's weather recommendations...</p>
        </div>
      );
    }
    
    if (!weather) return null;

    const getWeatherIcon = () => {
      switch (weather.condition) {
        case 'sunny':
          return <CloudSun className="h-6 w-6 text-custom-yellow mr-3" />;
        case 'cloudy':
          return <Cloud className="h-6 w-6 text-custom-yellow/70 mr-3" />;
        case 'rainy':
          return <Umbrella className="h-6 w-6 text-custom-blue mr-3" />;
        case 'cold':
          return <Snowflake className="h-6 w-6 text-custom-blue mr-3" />;
        case 'hot':
          return <Thermometer className="h-6 w-6 text-custom-red mr-3" />;
        default:
          return <CloudSun className="h-6 w-6 text-custom-yellow mr-3" />;
      }
    };
    
    const getBgColorClass = () => {
      switch (weather.condition) {
        case 'sunny':
          return 'from-custom-lightYellow to-custom-yellow/20';
        case 'cloudy':
          return 'from-custom-lightBlue to-custom-blue/10';
        case 'rainy':
          return 'from-custom-lightBlue to-custom-blue/30';
        case 'cold':
          return 'from-blue-50 to-indigo-50';
        case 'hot':
          return 'from-custom-lightRed to-custom-red/10';
        default:
          return 'from-custom-lightYellow to-custom-yellow/20';
      }
    };

    return (
      <div className={`p-4 rounded-lg bg-gradient-to-r ${getBgColorClass()} shadow-md flex items-center mb-6 hover-scale border border-white/50`}>
        {getWeatherIcon()}
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">Today's Weather-Based Recommendations</h3>
          <p className="text-sm text-gray-700">
            {Math.round(weather.temperature)}°C, {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowRecommendations(!showRecommendations)}
          className={`transition-colors duration-300 ${showRecommendations ? 'bg-custom-red/10 border-custom-red/30 text-custom-red' : 'bg-custom-green/10 border-custom-green/30 text-custom-green'}`}
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
      <div className="mb-8 space-y-6 fade-in-effect">
        <div className="flex items-center justify-center mb-2">
          <h3 className="text-xl font-semibold text-center px-4 py-1 bg-custom-yellow/20 rounded-full inline-block border-b-2 border-custom-yellow">
            {recommendations[0]?.reason || "Today's Recommendations"}
          </h3>
        </div>
        
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

  // Filter panel
  const FilterPanel = () => {
    return (
      <div className="mb-6 p-4 bg-custom-lightYellow/80 rounded-lg shadow-md border border-custom-yellow/30">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-64">
            <Input
              type="text" 
              placeholder="Search menu items..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-8 bg-white border-custom-yellow/30 focus:border-custom-yellow focus:ring-custom-yellow/30"
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-custom-red hover:text-custom-red/80"
              onClick={() => setSearchQuery("")}
            >
              {searchQuery && "✕"}
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap md:flex-nowrap justify-center md:justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white border-custom-red/30 text-custom-red hover:bg-custom-red/10">
                  <Filter size={14} />
                  Dietary
                  {(dietaryFilter.veg || dietaryFilter.spicy) && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-custom-red text-white">
                      {(dietaryFilter.veg ? 1 : 0) + (dietaryFilter.spicy ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDietaryFilter(prev => ({ ...prev, veg: !prev.veg }))}>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={dietaryFilter.veg} 
                      readOnly 
                      className="mr-2" 
                    />
                    Vegetarian
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDietaryFilter(prev => ({ ...prev, spicy: !prev.spicy }))}>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={dietaryFilter.spicy} 
                      readOnly 
                      className="mr-2" 
                    />
                    Spicy
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white border-custom-green/30 text-custom-green hover:bg-custom-green/10">
                  {sortOption.includes('price') ? (
                    sortOption === 'price-asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : sortOption.includes('name') ? (
                    sortOption === 'name-asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : null}
                  Sort: {sortOption === 'price-asc' ? 'Price ↑' : 
                         sortOption === 'price-desc' ? 'Price ↓' : 
                         sortOption === 'name-asc' ? 'Name A-Z' : 
                         sortOption === 'name-desc' ? 'Name Z-A' : 'Popular'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOption('popular')}>
                  Popular First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('price-asc')}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('price-desc')}>
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('name-asc')}>
                  Name: A to Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('name-desc')}>
                  Name: Z to A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {(searchQuery || selectedCategory !== "all" || sortOption !== "popular" || 
              dietaryFilter.veg || dietaryFilter.spicy) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetFilters}
                className="text-custom-red hover:bg-custom-red/10"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-custom-red">Our Menu</h2>
      
      <WeatherDisplay />
      
      <RecommendationSection />

      <FilterPanel />

      {/* Category Navigation */}
      <div className="mb-8">
        <Tabs
          defaultValue="all"
          className="w-full"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-custom-lightYellow/50">
            <TabsTrigger value="all" className="px-5 data-[state=active]:bg-custom-yellow data-[state=active]:text-white">
              All
            </TabsTrigger>
            {CATEGORIES.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="px-5 capitalize data-[state=active]:bg-custom-yellow data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurantId}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10 bg-custom-lightYellow/30 rounded-lg border border-custom-yellow/20">
            <p className="text-custom-darkGray">No items found matching your filters.</p>
            <Button 
              variant="link" 
              onClick={resetFilters}
              className="mt-2 text-custom-red"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;


import React, { useState, useEffect } from "react";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuItems } from "@/data/menuItems";
import AvailabilityTag from "@/components/AvailabilityTag";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";
import { MenuItem, CartItem, WeatherData, FoodRecommendation } from "@/types";
import MenuItemCard from "@/components/MenuItemCard";
import { Thermometer, Cloud, CloudRain, ArrowUp, ArrowDown, Filter } from "lucide-react";
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

interface MenuSectionProps {
  restaurantId: number;
}

const CATEGORIES = ["appetizers", "mains", "sides", "drinks", "desserts"];

const MenuSection: React.FC<MenuSectionProps> = ({ restaurantId }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  
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

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Mock weather data since API is failing
        const mockWeather: WeatherData = {
          temperature: 22,
          condition: "clear",
          humidity: 65,
          icon: ''
        };
        setWeather(mockWeather);
        generateRecommendations(mockWeather);
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
    if (!weather) return null;

    return (
      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm flex items-center mb-6 hover-scale">
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
          className="transition-colors duration-300"
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

  // Filter panel
  const FilterPanel = () => {
    return (
      <div className="mb-6 p-4 bg-custom-lightYellow/50 rounded-lg shadow-sm border border-custom-yellow/20">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-64">
            <Input
              type="text" 
              placeholder="Search menu items..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-8 bg-white"
            />
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              {searchQuery && "✕"}
            </button>
          </div>
          
          <div className="flex gap-2 flex-wrap md:flex-nowrap justify-center md:justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter size={14} />
                  Dietary
                  {(dietaryFilter.veg || dietaryFilter.spicy) && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
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
                <Button variant="outline" size="sm" className="flex items-center gap-1">
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
                className="text-custom-red hover:text-custom-red/80"
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
      <h2 className="text-3xl font-bold mb-6 text-center">Our Menu</h2>
      
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
        {displayedItems.length > 0 ? (
          displayedItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              restaurantId={restaurantId}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No items found matching your filters.</p>
            <Button 
              variant="link" 
              onClick={resetFilters}
              className="mt-2"
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

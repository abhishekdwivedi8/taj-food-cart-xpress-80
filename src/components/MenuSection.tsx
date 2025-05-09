
import React, { useState } from "react";
import { useOrderSystem } from "@/context/OrderSystemContext";
import MenuItemCard from "@/components/MenuItemCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuItems } from "@/data/menuItems";
import AvailabilityTag from "@/components/AvailabilityTag";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";

interface MenuSectionProps {
  restaurantId: number;
}

const CATEGORIES = ["appetizers", "mains", "sides", "drinks", "desserts"];

const MenuSection: React.FC<MenuSectionProps> = ({ restaurantId }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart } = useOrderSystem();

  // Filter menu items for this restaurant
  const restaurantMenu = menuItems.filter(
    (item) => item.restaurantId === restaurantId
  );

  // Further filter by category if a specific one is selected
  const displayedItems =
    selectedCategory === "all"
      ? restaurantMenu
      : restaurantMenu.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Menu</h2>

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
        {displayedItems.map((item) => {
          const isAvailable = isMenuItemAvailable(item.id);
          const discountedPrice = getDiscountedPrice(item);
          
          return (
            <MenuItemCard
              key={item.id}
              name={item.nameEn}
              nameJapanese={item.nameJa}
              price={discountedPrice}
              originalPrice={discountedPrice < item.price ? item.price : undefined}
              image={item.imageUrl}
              className={!isAvailable ? "opacity-75 cursor-not-allowed" : ""}
            >
              <div className="flex items-center justify-between mt-4">
                <AvailabilityTag itemId={item.id} price={item.price} />
                
                {isAvailable ? (
                  <Button 
                    onClick={() => addToCart(restaurantId, item)} 
                    variant="default"
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <Button 
                    disabled
                    variant="outline"
                  >
                    Not Available
                  </Button>
                )}
              </div>
            </MenuItemCard>
          );
        })}
      </div>
    </section>
  );
};

export default MenuSection;

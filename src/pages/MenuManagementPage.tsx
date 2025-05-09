
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  FileText,
  Settings,
  Clipboard,
  Search,
  X,
  Check,
  ArrowLeft,
  Plus,
  Percent,
  Tag,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { menuItems } from "@/data/menuItems";
import { useMenuAvailability } from "@/hooks/useMenuAvailability";
import { formatCurrency } from "@/utils/formatCurrency";

const MenuManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<1 | 2 | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemDiscount, setEditItemDiscount] = useState(0);
  
  // Group menu items by restaurant
  const restaurant1Items = menuItems.filter((item) => item.restaurantId === 1);
  const restaurant2Items = menuItems.filter((item) => item.restaurantId === 2);

  // Use our custom hook for availability management
  const { 
    availability, 
    setItemAvailability, 
    setItemDiscount, 
    checkItemAvailability, 
    getItemDiscount, 
    calculateFinalPrice 
  } = useMenuAvailability(menuItems);

  // Filter menu items based on search query and selected restaurant
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = 
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRestaurant = selectedRestaurant ? item.restaurantId === selectedRestaurant : true;
    
    return matchesSearch && matchesRestaurant;
  });

  // Handle availability toggle
  const handleToggleAvailability = (itemId: string, currentlyAvailable: boolean) => {
    setItemAvailability(itemId, !currentlyAvailable);
    
    toast.success(`Item ${!currentlyAvailable ? 'enabled' : 'disabled'} successfully`, {
      description: `The menu item is now ${!currentlyAvailable ? 'available' : 'unavailable'} to customers.`
    });
  };

  // Open discount edit dialog
  const handleEditDiscount = (itemId: string) => {
    setEditItemId(itemId);
    setEditItemDiscount(getItemDiscount(itemId));
    setEditMode(true);
  };

  // Save discount changes
  const handleSaveDiscount = () => {
    if (editItemId) {
      setItemDiscount(editItemId, editItemDiscount);
      
      toast.success(`Discount updated successfully`, {
        description: editItemDiscount > 0 
          ? `A ${editItemDiscount}% discount has been applied.` 
          : `The discount has been removed.`
      });
      
      setEditMode(false);
      setEditItemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white min-h-screen hidden md:block">
        <div className="p-4 flex items-center justify-center">
          <div className="bg-white p-2 rounded-lg mr-2">
            <Layout className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Manager Dashboard</h1>
        </div>
        <Separator className="bg-white/10 my-4" />
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            <li>
              <Link
                to="/manager"
                className="flex items-center gap-2 p-3 rounded-md hover:bg-white/20"
              >
                <Clipboard size={18} />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/analytics"
                className="flex items-center gap-2 p-3 rounded-md hover:bg-white/20"
              >
                <FileText size={18} />
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/menu"
                className="flex items-center gap-2 p-3 rounded-md bg-white/10 hover:bg-white/20"
              >
                <Clipboard size={18} />
                <span>Manage Menu</span>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 p-3 rounded-md hover:bg-white/20"
              >
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/manager" className="md:hidden">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Menu Management</h1>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-sm text-gray-500">Today</span>
              <div className="font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
              M
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Control Bar */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex flex-1 max-w-md relative">
              <Input
                type="search"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {selectedRestaurant 
                      ? `Restaurant ${selectedRestaurant}` 
                      : 'All Restaurants'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedRestaurant(null)}>
                    All Restaurants
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRestaurant(1)}>
                    Restaurant 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRestaurant(2)}>
                    Restaurant 2
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </div>
          </div>

          {/* Menu Management Tabs */}
          <Tabs defaultValue="items" className="mb-6">
            <TabsList>
              <TabsTrigger value="items">Menu Items</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="promotions">Promotions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Menu Items Management</span>
                    <Badge variant="outline" className="ml-2">
                      {filteredItems.length} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Final Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                          const isAvailable = checkItemAvailability(item.id);
                          const discount = getItemDiscount(item.id);
                          const finalPrice = calculateFinalPrice(item);
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  {item.imageUrl && (
                                    <div className="h-10 w-10 mr-3 overflow-hidden rounded-md bg-gray-100">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.nameEn}
                                        className="h-full w-full object-cover" 
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <div>{item.nameEn}</div>
                                    <div className="text-xs text-gray-500">{item.nameJa}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>Restaurant {item.restaurantId}</TableCell>
                              <TableCell>{formatCurrency(item.price)}</TableCell>
                              <TableCell>
                                {discount > 0 ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    {discount}% off
                                  </Badge>
                                ) : (
                                  <span className="text-gray-500">No discount</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {discount > 0 ? (
                                  <div>
                                    <span className="text-gray-500 line-through mr-1">
                                      {formatCurrency(item.price)}
                                    </span>
                                    <span className="font-medium text-green-700">
                                      {formatCurrency(finalPrice)}
                                    </span>
                                  </div>
                                ) : (
                                  formatCurrency(item.price)
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={isAvailable ? "default" : "secondary"}
                                  className={isAvailable ? "bg-green-500" : "bg-gray-400"}
                                >
                                  {isAvailable ? "Available" : "Unavailable"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleToggleAvailability(item.id, isAvailable)}
                                  >
                                    {isAvailable ? (
                                      <X className="h-4 w-4 mr-1" />
                                    ) : (
                                      <Check className="h-4 w-4 mr-1" />
                                    )}
                                    {isAvailable ? "Disable" : "Enable"}
                                  </Button>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditDiscount(item.id)}
                                  >
                                    <Percent className="h-4 w-4 mr-1" />
                                    Discount
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No menu items found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Menu Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Manage your menu categories here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="promotions">
              <Card>
                <CardHeader>
                  <CardTitle>Promotions & Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Manage special promotions and offers here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Edit Discount Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item Discount</DialogTitle>
            <DialogDescription>
              Set a discount percentage for this menu item.
            </DialogDescription>
          </DialogHeader>
          
          {editItemId && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="discount">Discount Percentage</Label>
                    <Badge variant="outline" className="ml-auto">
                      {editItemDiscount}%
                    </Badge>
                  </div>
                  
                  <Slider
                    id="discount"
                    min={0}
                    max={75}
                    step={5}
                    value={[editItemDiscount]}
                    onValueChange={(value) => setEditItemDiscount(value[0])}
                    className="py-4"
                  />
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[0, 10, 25].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        onClick={() => setEditItemDiscount(percent)}
                        className={editItemDiscount === percent ? "border-primary" : ""}
                      >
                        {percent}%
                      </Button>
                    ))}
                    
                    {[30, 50, 75].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        onClick={() => setEditItemDiscount(percent)}
                        className={editItemDiscount === percent ? "border-primary" : ""}
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Preview of the discount effect */}
                {editItemId && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Pricing Preview</h4>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Original Price:</span>
                      <span>
                        {formatCurrency(menuItems.find(i => i.id === editItemId)?.price || 0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600">Discount Amount:</span>
                      <span className="text-red-600">
                        -{formatCurrency((menuItems.find(i => i.id === editItemId)?.price || 0) * (editItemDiscount / 100))}
                      </span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center font-medium">
                      <span>Final Price:</span>
                      <span className="text-green-700">
                        {formatCurrency((menuItems.find(i => i.id === editItemId)?.price || 0) * (1 - editItemDiscount / 100))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSaveDiscount}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagementPage;

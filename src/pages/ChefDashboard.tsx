import React, { useState } from "react";
import { ChefHat, Clock, Check, Info, AlertTriangle, Search, Package, Bell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { OrderWithStatus } from "@/context/OrderSystemContext";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatCurrency";
import { toast } from "@/components/ui/sonner";

const ChefDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithStatus | null>(null);
  const [chefNote, setChefNote] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [activeTab, setActiveTab] = useState<string>("new");
  
  const { 
    getConfirmedOrders, 
    getPreparingOrders,
    getPreparedOrders,
    markOrderPreparing,
    markOrderPrepared,
    markOrderCompleted
  } = useOrderSystem();

  const confirmedOrders = getConfirmedOrders();
  const preparingOrders = getPreparingOrders();
  const readyOrders = getPreparedOrders();
  
  const handleViewOrderDetails = (order: OrderWithStatus) => {
    setSelectedOrder(order);
    setChefNote(order.chefNote || "");
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setChefNote("");
  };

  const handleStartPreparing = () => {
    if (selectedOrder) {
      markOrderPreparing(selectedOrder.id);
      // Keep the dialog open but update the selected order
      setSelectedOrder({...selectedOrder, status: 'preparing'});
      
      toast.success("Started preparing order", {
        description: `Order #${selectedOrder.id.substring(6, 14)} is now being prepared`,
        duration: 3000
      });
    }
  };

  const handleMarkPrepared = () => {
    if (selectedOrder) {
      markOrderPrepared(selectedOrder.id, chefNote);
      toast.success("Order marked as ready", {
        description: `Order #${selectedOrder.id.substring(6, 14)} is ready to serve`,
        duration: 3000
      });
      setSelectedOrder(null);
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    markOrderCompleted(orderId);
    toast.success("Order completed", {
      description: "The order has been successfully delivered",
      duration: 3000
    });
  };

  // Filter orders based on search term
  const filteredConfirmedOrders = confirmedOrders.filter(order => {
    return order.id.toLowerCase().includes(orderFilter.toLowerCase()) ||
           order.customerId.toLowerCase().includes(orderFilter.toLowerCase());
  });

  const filteredPreparingOrders = preparingOrders.filter(order => {
    return order.id.toLowerCase().includes(orderFilter.toLowerCase()) ||
           order.customerId.toLowerCase().includes(orderFilter.toLowerCase());
  });
  
  const filteredReadyOrders = readyOrders.filter(order => {
    return order.id.toLowerCase().includes(orderFilter.toLowerCase()) ||
           order.customerId.toLowerCase().includes(orderFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="bg-custom-red text-white p-2 rounded-lg mr-3">
            <ChefHat className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-custom-darkGray">Chef Dashboard</h1>
            <p className="text-gray-500">Manage kitchen orders efficiently</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
            <Input 
              placeholder="Search orders..." 
              className="pl-9"
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Order Queues */}
        <div className="flex-1">
          <Tabs defaultValue="new" className="w-full" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-3 mb-4 bg-white shadow-sm">
              <TabsTrigger value="new" className="flex gap-2 items-center data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Badge className="bg-blue-500 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  {filteredConfirmedOrders.length}
                </Badge>
                New Orders
              </TabsTrigger>
              <TabsTrigger value="preparing" className="flex gap-2 items-center data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Badge className="bg-amber-500 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  {filteredPreparingOrders.length}
                </Badge>
                Preparing
              </TabsTrigger>
              <TabsTrigger value="ready" className="flex gap-2 items-center data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <Badge className="bg-green-500 h-6 w-6 flex items-center justify-center p-0 rounded-full">
                  {filteredReadyOrders.length}
                </Badge>
                Ready
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="new" className="mt-0">
              <Card className="border-blue-100 shadow-md">
                <CardHeader className="pb-2 bg-blue-50 border-b border-blue-100">
                  <CardTitle className="text-lg flex items-center">
                    <Badge className="mr-2 bg-blue-500">New</Badge>
                    Confirmed Orders
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    New orders waiting to be prepared
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                    {filteredConfirmedOrders.length > 0 ? (
                      filteredConfirmedOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="border border-blue-100 bg-blue-50 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors shadow-sm"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-500">Table {order.restaurantId}</Badge>
                                <span className="font-medium text-gray-700">Order #{order.id.substring(6, 14)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock size={14} />
                                <span>{new Date(order.date).toLocaleTimeString()}</span>
                                <span>•</span>
                                <span>{order.items.length} item(s)</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white shadow-sm"
                            >
                              Start
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-blue-50/50 rounded-lg">
                        <Info className="h-12 w-12 text-blue-300 mb-2" />
                        <p>No new orders to prepare</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preparing" className="mt-0">
              <Card className="border-amber-100 shadow-md">
                <CardHeader className="pb-2 bg-amber-50 border-b border-amber-100">
                  <CardTitle className="text-lg flex items-center">
                    <Badge className="mr-2 bg-amber-500">In Progress</Badge>
                    Preparing Orders
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Orders currently being prepared
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                    {filteredPreparingOrders.length > 0 ? (
                      filteredPreparingOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="border border-amber-100 bg-amber-50 rounded-lg p-3 cursor-pointer hover:bg-amber-100 transition-colors animate-pulse-slow shadow-sm"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-amber-500">Table {order.restaurantId}</Badge>
                                <span className="font-medium text-gray-700">Order #{order.id.substring(6, 14)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock size={14} />
                                <span>{new Date(order.date).toLocaleTimeString()}</span>
                                <span>•</span>
                                <span>{order.items.length} item(s)</span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-amber-500 text-white hover:bg-amber-600 hover:text-white shadow-sm"
                            >
                              Mark Ready
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-amber-50/50 rounded-lg">
                        <AlertTriangle className="h-12 w-12 text-amber-300 mb-2" />
                        <p>No orders currently being prepared</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ready" className="mt-0">
              <Card className="border-green-100 shadow-md">
                <CardHeader className="pb-2 bg-green-50 border-b border-green-100">
                  <CardTitle className="text-lg flex items-center">
                    <Badge className="mr-2 bg-green-500">Ready</Badge>
                    Orders Ready to Serve
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Completed orders waiting to be served
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                    {filteredReadyOrders.length > 0 ? (
                      filteredReadyOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="border border-green-100 bg-green-50 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition-colors shadow-sm"
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-500">Table {order.restaurantId}</Badge>
                                <span className="font-medium text-gray-700">Order #{order.id.substring(6, 14)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock size={14} />
                                <span>{new Date(order.date).toLocaleTimeString()}</span>
                                {order.chefNote && (
                                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                                    Has notes
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-green-500 text-white hover:bg-green-600 hover:text-white shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteOrder(order.id);
                              }}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Complete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500 bg-green-50/50 rounded-lg">
                        <Package className="h-12 w-12 text-green-300 mb-2" />
                        <p>No orders ready to serve</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Order Details */}
        <div className="lg:w-2/5 xl:w-1/3">
          <Card className="h-full shadow-md">
            {selectedOrder ? (
              <div className="h-full flex flex-col">
                <CardHeader className="pb-2 bg-gray-50 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-custom-darkGray">Order Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-800"
                      onClick={handleCloseDetails}
                    >
                      &times;
                    </Button>
                  </div>
                  <CardDescription className="text-gray-600">
                    #{selectedOrder.id.substring(6, 14)} • {new Date(selectedOrder.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Table</p>
                      <p className="font-semibold text-custom-darkGray">Table {selectedOrder.restaurantId}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="flex items-center gap-2">
                        {selectedOrder.status === 'confirmed' && <Badge className="bg-blue-500">New</Badge>}
                        {selectedOrder.status === 'preparing' && <Badge className="bg-amber-500">Preparing</Badge>}
                        {selectedOrder.status === 'ready' && <Badge className="bg-green-500">Ready</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex-grow">
                    <h3 className="font-semibold mb-2 text-gray-700">Order Items</h3>
                    <div className="bg-gray-50 rounded-md p-3 overflow-y-auto max-h-[240px] shadow-inner">
                      {selectedOrder.items.map((item, index) => (
                        <div 
                          key={`${selectedOrder.id}-${item.id}-${index}`}
                          className="py-2 border-b last:border-0 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium text-custom-darkGray">{item.quantity} × {item.nameEn}</p>
                            <p className="text-sm text-gray-500">{item.nameHi}</p>
                          </div>
                          <p className="font-semibold text-custom-red">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex justify-between font-semibold">
                      <span className="text-custom-darkGray">Total Amount:</span>
                      <span className="text-custom-red">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>

                  {selectedOrder.status === 'confirmed' && (
                    <div className="mt-auto">
                      <Button 
                        className="w-full bg-custom-blue hover:bg-custom-blue/80 text-white shadow-md"
                        onClick={handleStartPreparing}
                      >
                        Start Preparing
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <div className="mt-auto">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chef Notes (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-md resize-none focus:border-custom-green focus:ring focus:ring-custom-green/20"
                          rows={2}
                          placeholder="Add any special notes about this order..."
                          value={chefNote}
                          onChange={(e) => setChefNote(e.target.value)}
                        ></textarea>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 shadow-md"
                        onClick={handleMarkPrepared}
                      >
                        <CheckCircle className="h-5 w-5" />
                        Mark as Prepared
                      </Button>
                    </div>
                  )}
                  
                  {selectedOrder.status === 'ready' && (
                    <div className="mt-auto">
                      <div className="mb-3 bg-green-50 p-3 rounded-md">
                        <p className="font-medium text-green-800 flex items-center gap-2">
                          <Check className="h-5 w-5" />
                          Order is ready to serve
                        </p>
                        {selectedOrder.chefNote && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
                            <p className="font-medium text-blue-800">Chef Note:</p>
                            <p className="text-gray-700">{selectedOrder.chefNote}</p>
                          </div>
                        )}
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                        onClick={() => {
                          handleCompleteOrder(selectedOrder.id);
                          setSelectedOrder(null);
                        }}
                      >
                        Complete Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500">
                <ChefHat className="h-16 w-16 text-custom-red mb-4" />
                <h3 className="text-xl font-medium text-custom-darkGray mb-2">No Order Selected</h3>
                <p className="text-center">
                  Select an order from the list to see details and start preparation
                </p>
                
                <div className="mt-8 bg-gray-50 p-4 rounded-lg w-full max-w-xs shadow-inner">
                  <h4 className="font-medium text-custom-darkGray mb-2 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-custom-red" /> Quick Tips
                  </h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue font-bold mt-0.5">•</span>
                      Click on any order to see details
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue font-bold mt-0.5">•</span>
                      Use tabs to filter different order stages
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue font-bold mt-0.5">•</span>
                      Add notes for servers when completing orders
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;

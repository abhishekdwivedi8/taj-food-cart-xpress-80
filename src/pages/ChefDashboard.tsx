import React, { useState } from "react";
import { X, ChefHat, Clock, Check, User, Info, AlertTriangle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { OrderWithStatus } from "@/context/OrderSystemContext";

const ChefDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithStatus | null>(null);
  const [chefNote, setChefNote] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  
  const { 
    getConfirmedOrders, 
    getPreparingOrders,
    markOrderPreparing,
    markOrderPrepared
  } = useOrderSystem();

  const confirmedOrders = getConfirmedOrders();
  const preparingOrders = getPreparingOrders();
  
  const handleViewOrderDetails = (order: OrderWithStatus) => {
    setSelectedOrder(order);
    setChefNote("");
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleStartPreparing = () => {
    if (selectedOrder) {
      markOrderPreparing(selectedOrder.id);
      // Keep the dialog open but update the selected order
      setSelectedOrder({...selectedOrder, status: 'preparing'});
    }
  };

  const handleMarkPrepared = () => {
    if (selectedOrder) {
      markOrderPrepared(selectedOrder.id, chefNote);
      setSelectedOrder(null);
    }
  };

  // Filter orders
  const filteredConfirmedOrders = confirmedOrders.filter(order => {
    return order.id.toLowerCase().includes(orderFilter.toLowerCase()) ||
           order.customerId.toLowerCase().includes(orderFilter.toLowerCase());
  });

  const filteredPreparingOrders = preparingOrders.filter(order => {
    return order.id.toLowerCase().includes(orderFilter.toLowerCase()) ||
           order.customerId.toLowerCase().includes(orderFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-restaurant-primary text-white p-2 rounded-lg mr-3">
            <ChefHat className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Chef Dashboard</h1>
            <p className="text-gray-500">Manage and prepare orders</p>
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
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-restaurant-primary flex items-center justify-center text-white font-bold">
              C
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Order Queues */}
        <div className="flex-1">
          {/* Confirmed Orders */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Badge className="mr-2 bg-blue-500">New</Badge>
                Confirmed Orders
              </h2>
              <Badge variant="outline" className="text-blue-500">
                {filteredConfirmedOrders.length} order{filteredConfirmedOrders.length !== 1 && 's'}
              </Badge>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[350px]">
              {filteredConfirmedOrders.length > 0 ? (
                filteredConfirmedOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="border border-blue-100 bg-blue-50 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors flex justify-between items-center group"
                    onClick={() => handleViewOrderDetails(order)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500">Table {order.restaurantId}</Badge>
                        <span className="font-medium">Order #{order.id.substring(6, 14)}</span>
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrderDetails(order);
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Info className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No new orders to prepare</p>
                </div>
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Badge className="mr-2 bg-amber-500">In Progress</Badge>
                Preparing Orders
              </h2>
              <Badge variant="outline" className="text-amber-500">
                {filteredPreparingOrders.length} order{filteredPreparingOrders.length !== 1 && 's'}
              </Badge>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-[350px]">
              {filteredPreparingOrders.length > 0 ? (
                filteredPreparingOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="border border-amber-100 bg-amber-50 rounded-lg p-3 cursor-pointer hover:bg-amber-100 transition-colors flex justify-between items-center group animate-pulse-slow"
                    onClick={() => handleViewOrderDetails(order)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500">Table {order.restaurantId}</Badge>
                        <span className="font-medium">Order #{order.id.substring(6, 14)}</span>
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-white hover:bg-amber-600 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewOrderDetails(order);
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No orders currently being prepared</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Order Details */}
        <div className="lg:w-2/5 xl:w-1/3">
          <div className="bg-white rounded-lg shadow-md h-full">
            {selectedOrder ? (
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                    <p className="text-gray-500">#{selectedOrder.id.substring(6, 14)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800"
                    onClick={handleCloseDetails}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col flex-grow overflow-hidden">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Table</p>
                      <p className="font-semibold">Table {selectedOrder.restaurantId}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold capitalize">{selectedOrder.status}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold">{new Date(selectedOrder.date).toLocaleTimeString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-semibold truncate">{selectedOrder.customerId.substring(0, 8)}...</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 pb-1 border-b">Items to Prepare</h3>
                    <div className="overflow-y-auto max-h-[300px]">
                      {selectedOrder.items.map((item, index) => (
                        <div 
                          key={`${selectedOrder.id}-${item.id}`}
                          className="py-3 border-b last:border-0 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{item.quantity} × {item.nameEn}</p>
                            <p className="text-sm text-gray-500">{item.nameHi}</p>
                          </div>
                          <div className="flex items-center justify-center h-6 w-6 bg-gray-100 rounded-full text-sm">
                            {item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.status === 'confirmed' && (
                    <div className="flex-shrink-0 flex gap-4 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleCloseDetails}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-restaurant-primary hover:bg-restaurant-primary/80 text-white"
                        onClick={handleStartPreparing}
                      >
                        Start Preparing
                      </Button>
                    </div>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <div className="flex-shrink-0 mt-auto">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Chef Note (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-md resize-none"
                          rows={2}
                          placeholder="Add any notes about this order..."
                          value={chefNote}
                          onChange={(e) => setChefNote(e.target.value)}
                        ></textarea>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleMarkPrepared}
                      >
                        <Check className="h-5 w-5 mr-2" />
                        Mark as Prepared
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500">
                <ChefHat className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Order Selected</h3>
                <p className="text-center">
                  Select an order from the list to see details and start preparation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChefDashboard;

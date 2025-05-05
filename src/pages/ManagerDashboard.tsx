import React, { useState } from "react";
import {
  Layout,
  FileText,
  Settings,
  Clipboard,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { Badge } from "@/components/ui/badge";

const ManagerDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statsView, setStatsView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const {
    orders,
    getPendingOrders,
    getOrderById,
    confirmOrder,
    cancelOrder,
    completePayment,
    getTotalSales,
    getTotalOrdersCount,
    getRestaurantSales,
  } = useOrderSystem();

  const pendingTable1Orders = getPendingOrders(1);
  const pendingTable2Orders = getPendingOrders(2);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const selectedOrderDetails = selectedOrder ? getOrderById(selectedOrder) : null;

  const handleConfirmOrder = () => {
    if (selectedOrder) {
      confirmOrder(selectedOrder);
      setSelectedOrder(null);
    }
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      cancelOrder(selectedOrder);
      setSelectedOrder(null);
    }
  };

  const handleCashPayment = () => {
    if (selectedOrder) {
      completePayment(selectedOrder, 'cash');
    }
  };

  // Stats data (simulated)
  const statsData = {
    daily: {
      orders: getTotalOrdersCount(),
      sales: getTotalSales(),
      average: getTotalOrdersCount() ? getTotalSales() / getTotalOrdersCount() : 0,
      table1: getRestaurantSales(1),
      table2: getRestaurantSales(2),
      percentChange: 4.6,
    },
    weekly: {
      orders: getTotalOrdersCount() * 4,
      sales: getTotalSales() * 4,
      average: getTotalOrdersCount() ? (getTotalSales() * 4) / (getTotalOrdersCount() * 4) : 0,
      table1: getRestaurantSales(1) * 4,
      table2: getRestaurantSales(2) * 4,
      percentChange: 2.8,
    },
    monthly: {
      orders: getTotalOrdersCount() * 15,
      sales: getTotalSales() * 15,
      average: getTotalOrdersCount() ? (getTotalSales() * 15) / (getTotalOrdersCount() * 15) : 0,
      table1: getRestaurantSales(1) * 15,
      table2: getRestaurantSales(2) * 15,
      percentChange: 8.3,
    },
  };

  const currentStats = statsData[statsView];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-restaurant-primary text-white min-h-screen hidden md:block">
        <div className="p-4 flex items-center justify-center">
          <div className="bg-white p-2 rounded-lg mr-2">
            <Layout className="h-6 w-6 text-restaurant-primary" />
          </div>
          <h1 className="text-xl font-semibold">Manager Dashboard</h1>
        </div>
        <Separator className="bg-white/10 my-4" />
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center gap-2 p-3 rounded-md bg-white/10 hover:bg-white/20"
              >
                <Clipboard size={18} />
                <span>Orders</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 p-3 rounded-md hover:bg-white/20"
              >
                <FileText size={18} />
                <span>Reports</span>
              </a>
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
          <div className="md:hidden">
            <Button variant="outline" size="icon">
              <Layout className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-xl font-semibold md:hidden">Manager Dashboard</h1>
          <div className="flex items-center">
            <div className="mr-4">
              <span className="text-sm text-gray-500">Today</span>
              <div className="font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="h-8 w-8 bg-restaurant-primary rounded-full flex items-center justify-center text-white">
              M
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Dashboard Stats */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
              <div className="flex gap-2">
                <Button
                  variant={statsView === 'daily' ? "default" : "outline"}
                  onClick={() => setStatsView('daily')}
                  className={statsView === 'daily' ? "bg-restaurant-primary text-white" : ""}
                >
                  Daily
                </Button>
                <Button
                  variant={statsView === 'weekly' ? "default" : "outline"}
                  onClick={() => setStatsView('weekly')}
                  className={statsView === 'weekly' ? "bg-restaurant-primary text-white" : ""}
                >
                  Weekly
                </Button>
                <Button
                  variant={statsView === 'monthly' ? "default" : "outline"}
                  onClick={() => setStatsView('monthly')}
                  className={statsView === 'monthly' ? "bg-restaurant-primary text-white" : ""}
                >
                  Monthly
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-500">
                    <span>Total Orders</span>
                    <Clipboard className="h-4 w-4 text-restaurant-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentStats.orders}</div>
                  <div className="flex items-center mt-1 text-sm">
                    <span className={currentStats.percentChange >= 0 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
                      {currentStats.percentChange >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(currentStats.percentChange)}%
                    </span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-500">
                    <span>Total Revenue</span>
                    <DollarSign className="h-4 w-4 text-restaurant-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(currentStats.sales)}
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <span className={currentStats.percentChange >= 0 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
                      {currentStats.percentChange >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(currentStats.percentChange)}%
                    </span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-500">
                    <span>Table 1 Sales</span>
                    <Zap className="h-4 w-4 text-restaurant-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(currentStats.table1)}
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-gray-500">
                      {((currentStats.table1 / currentStats.sales) * 100).toFixed(1)}% of total sales
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-gray-500">
                    <span>Table 2 Sales</span>
                    <Zap className="h-4 w-4 text-restaurant-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(currentStats.table2)}
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-gray-500">
                      {((currentStats.table2 / currentStats.sales) * 100).toFixed(1)}% of total sales
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table 1 Orders */}
            <Card className={`border-l-4 ${pendingTable1Orders.length > 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader className="pb-2">
                <CardTitle>Table 1 Orders</CardTitle>
                <CardDescription>
                  {pendingTable1Orders.length > 0 
                    ? `${pendingTable1Orders.length} pending order(s)` 
                    : 'No new orders'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTable1Orders.length > 0 ? (
                  <div className="space-y-3">
                    {pendingTable1Orders.map((order) => (
                      <div 
                        key={order.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedOrder === order.id 
                            ? 'bg-restaurant-primary text-white' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Order #{order.id.substring(6, 14)}</p>
                            <div className="flex gap-2 text-xs mt-1">
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                <span className="truncate max-w-[80px]">
                                  {order.customerId.substring(0, 8)}...
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{new Date(order.date).toLocaleTimeString()}</span>
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold">{formatCurrency(order.total)}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {order.items.length} item(s)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                    <AlertCircle className="h-10 w-10 mb-2 text-gray-400" />
                    <p>No pending orders for Table 1</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Table 2 Orders */}
            <Card className={`border-l-4 ${pendingTable2Orders.length > 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader className="pb-2">
                <CardTitle>Table 2 Orders</CardTitle>
                <CardDescription>
                  {pendingTable2Orders.length > 0 
                    ? `${pendingTable2Orders.length} pending order(s)` 
                    : 'No new orders'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingTable2Orders.length > 0 ? (
                  <div className="space-y-3">
                    {pendingTable2Orders.map((order) => (
                      <div 
                        key={order.id} 
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedOrder === order.id 
                            ? 'bg-restaurant-primary text-white' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Order #{order.id.substring(6, 14)}</p>
                            <div className="flex gap-2 text-xs mt-1">
                              <span className="flex items-center gap-1">
                                <User size={12} />
                                <span className="truncate max-w-[80px]">
                                  {order.customerId.substring(0, 8)}...
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{new Date(order.date).toLocaleTimeString()}</span>
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold">{formatCurrency(order.total)}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {order.items.length} item(s)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                    <AlertCircle className="h-10 w-10 mb-2 text-gray-400" />
                    <p>No pending orders for Table 2</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Order Details & Order History */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selected Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  {selectedOrderDetails 
                    ? `Order #${selectedOrderDetails.id.substring(6, 14)} from Table ${selectedOrderDetails.restaurantId}` 
                    : 'Select an order to view details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedOrderDetails ? (
                  <div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-500">Customer ID:</span>
                        <span className="font-medium">{selectedOrderDetails.customerId.substring(0, 10)}...</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-500">Date & Time:</span>
                        <span className="font-medium">{new Date(selectedOrderDetails.date).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-500">Status:</span>
                        <Badge variant={selectedOrderDetails.status === 'pending' ? 'outline' : 'default'}>
                          {selectedOrderDetails.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-500">Payment Status:</span>
                        <Badge variant={selectedOrderDetails.isPaid ? "default" : "secondary"}>
                          {selectedOrderDetails.isPaid ? 'Paid' : 'Pending Payment'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {selectedOrderDetails.items.map((item) => (
                          <div key={item.id} className="flex justify-between py-1 border-b">
                            <span>
                              {item.quantity} × {item.nameEn}
                            </span>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(selectedOrderDetails.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <FileText className="h-10 w-10 mb-2 text-gray-400" />
                    <p>Select an order to view details</p>
                  </div>
                )}
              </CardContent>
              {selectedOrderDetails && selectedOrderDetails.status === 'pending' && (
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={handleCancelOrder}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleConfirmOrder}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Order
                  </Button>
                </CardFooter>
              )}
              {selectedOrderDetails && selectedOrderDetails.status !== 'pending' && !selectedOrderDetails.isPaid && (
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full bg-restaurant-primary"
                    onClick={handleCashPayment}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Mark as Paid (Cash)
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Order History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    All past and current orders
                  </CardDescription>
                </div>
                <div className="flex-shrink-0">
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="max-w-[200px] text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto pr-2">
                  <div className="space-y-2">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedOrder === order.id 
                              ? 'bg-restaurant-primary/10 border-restaurant-primary/50' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedOrder(order.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-restaurant-secondary/10 text-restaurant-primary">
                                  Table {order.restaurantId}
                                </Badge>
                                <p className="font-medium">#{order.id.substring(6, 14)}</p>
                                <Badge>{order.status}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Calendar size={12} />
                                <span>{new Date(order.date).toLocaleDateString()}</span>
                                <Clock size={12} />
                                <span>{new Date(order.date).toLocaleTimeString()}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(order.total)}</p>
                              <span className={`text-xs ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                                {order.isPaid ? 'Paid' : 'Payment Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <p>No orders found</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;

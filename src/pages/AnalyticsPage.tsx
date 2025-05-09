
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  FileText,
  Settings,
  Clipboard,
  Calendar,
  ChevronDown,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getDailyRevenueData,
  getTopSellingItems,
  getRevenueByHour,
  getRevenueByRestaurant,
  getOrdersByStatus,
  generateAIInsights,
} from "@/utils/analyticsUtils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<"7days" | "14days" | "30days" | "90days">("14days");
  const [activeTab, setActiveTab] = useState("revenue");
  const { orders, getTotalSales, getTotalOrdersCount } = useOrderSystem();

  // Get data for charts
  const dailyRevenue = getDailyRevenueData(orders, dateRange === "7days" ? 7 : dateRange === "14days" ? 14 : dateRange === "30days" ? 30 : 90);
  const topSellingItems = getTopSellingItems(orders);
  const hourlyRevenue = getRevenueByHour(orders);
  const restaurantRevenue = getRevenueByRestaurant(orders);
  const ordersByStatus = getOrdersByStatus(orders);
  const aiInsights = generateAIInsights(orders);

  // Transform data for specific charts
  const topItemsForChart = topSellingItems.map(item => ({
    name: item.name,
    value: item.count,
    revenue: item.revenue,
  }));

  // Colors for charts
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  // Date range handler
  const handleDateRangeChange = (value: string) => {
    setDateRange(value as "7days" | "14days" | "30days" | "90days");
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
                className="flex items-center gap-2 p-3 rounded-md bg-white/10 hover:bg-white/20"
              >
                <FileText size={18} />
                <span>Reports</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manager/menu"
                className="flex items-center gap-2 p-3 rounded-md hover:bg-white/20"
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
            <h1 className="text-xl font-semibold">Analytics & Reports</h1>
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
          {/* Analytics Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Business Analytics</h2>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <Select value={dateRange} onValueChange={handleDateRangeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="14days">Last 14 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Print Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(getTotalSales())}</div>
                <div className="flex items-center mt-1 text-sm">
                  <span className="text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    4.5%
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalOrdersCount()}</div>
                <div className="flex items-center mt-1 text-sm">
                  <span className="text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    2.8%
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Avg Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(getTotalOrdersCount() ? getTotalSales() / getTotalOrdersCount() : 0)}
                </div>
                <div className="flex items-center mt-1 text-sm">
                  <span className="text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    1.2%
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getTotalOrdersCount() ? 
                    `${Math.round((orders.filter(o => o.status === 'completed').length / getTotalOrdersCount()) * 100)}%` : 
                    "0%"}
                </div>
                <div className="flex items-center mt-1 text-sm">
                  <span className="text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    3.1%
                  </span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="mb-6 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Intelligent analysis of your business data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.length > 0 ? (
                  aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">Insight</Badge>
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Not enough data to generate insights.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chart Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="revenue">
                  <LineChart className="h-4 w-4 mr-2" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="products">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <PieChart className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="revenue" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Daily revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dailyRevenue}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value).replace('$', '')} 
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value as number)} 
                        labelFormatter={(date) => new Date(date as string).toLocaleDateString()} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Revenue Distribution</CardTitle>
                    <CardDescription>Revenue by hour of day</CardDescription>
                  </CardHeader>
                  <CardContent className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => {
                            if (hour === 0) return '12am';
                            if (hour === 12) return '12pm';
                            return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
                          }}
                        />
                        <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value as number)} 
                          labelFormatter={(hour) => {
                            const h = hour as number;
                            if (h === 0) return '12:00 AM';
                            if (h === 12) return '12:00 PM';
                            return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
                          }}
                        />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Restaurant</CardTitle>
                    <CardDescription>Performance by location</CardDescription>
                  </CardHeader>
                  <CardContent className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={restaurantRevenue}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {restaurantRevenue.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>By quantity sold</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topItemsForChart}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Quantity Sold" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Revenue</CardTitle>
                    <CardDescription>Revenue by product</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topItemsForChart}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          tickFormatter={(value) => formatCurrency(value).replace('$', '')} 
                        />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Orders by Status</CardTitle>
                    <CardDescription>Current order status distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ordersByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="status"
                        >
                          {ordersByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Processing Performance</CardTitle>
                    <CardDescription>Avg time by order stage (minutes)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'New to Confirmed', value: 2.5 },
                          { name: 'Confirmed to Preparing', value: 4.3 },
                          { name: 'Preparing to Ready', value: 15.7 },
                          { name: 'Ready to Completed', value: 3.8 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;

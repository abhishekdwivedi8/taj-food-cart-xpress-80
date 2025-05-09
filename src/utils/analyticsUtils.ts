
import { OrderWithStatus } from '@/context/orderSystem/types';

// Function to group orders by date and calculate daily revenue
export const getDailyRevenueData = (orders: OrderWithStatus[], days = 14) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  // Generate an array of dates for the past [days] days
  const dateRange = Array(days + 1).fill(0).map((_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (days - index));
    return date;
  });

  // Format date as YYYY-MM-DD for easy comparison
  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Initialize revenue data with all dates having 0 revenue
  const revenueByDate: { [key: string]: { date: string, revenue: number } } = {};
  dateRange.forEach(date => {
    const dateKey = formatDateKey(date);
    revenueByDate[dateKey] = { 
      date: dateKey,
      revenue: 0 
    };
  });

  // Group paid orders by date
  orders.forEach(order => {
    if (order.isPaid) {
      const orderDate = new Date(order.date);
      if (orderDate >= startDate && orderDate <= today) {
        const dateKey = formatDateKey(orderDate);
        if (revenueByDate[dateKey]) {
          revenueByDate[dateKey].revenue += order.total;
        }
      }
    }
  });

  // Convert to array for chart display
  return Object.values(revenueByDate);
};

// Function to get top selling items
export const getTopSellingItems = (orders: OrderWithStatus[], limit = 5) => {
  const itemCounts: { [key: string]: { id: string, name: string, count: number, revenue: number } } = {};

  orders.forEach(order => {
    if (order.isPaid) {
      order.items.forEach(item => {
        const itemId = item.id;
        if (!itemCounts[itemId]) {
          itemCounts[itemId] = { 
            id: item.id,
            name: item.nameEn, 
            count: 0,
            revenue: 0 
          };
        }
        itemCounts[itemId].count += item.quantity;
        itemCounts[itemId].revenue += (item.price * item.quantity);
      });
    }
  });

  return Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Calculate revenue by time of day
export const getRevenueByHour = (orders: OrderWithStatus[]) => {
  const hourlyRevenue = Array(24).fill(0).map((_, i) => ({ hour: i, revenue: 0 }));
  
  orders.forEach(order => {
    if (order.isPaid) {
      const orderHour = new Date(order.date).getHours();
      hourlyRevenue[orderHour].revenue += order.total;
    }
  });
  
  return hourlyRevenue;
};

// Calculate revenue by restaurant
export const getRevenueByRestaurant = (orders: OrderWithStatus[]) => {
  const restaurantRevenue: { [key: number]: number } = {};
  
  orders.forEach(order => {
    if (order.isPaid) {
      const restaurantId = order.restaurantId;
      if (!restaurantRevenue[restaurantId]) {
        restaurantRevenue[restaurantId] = 0;
      }
      restaurantRevenue[restaurantId] += order.total;
    }
  });
  
  return Object.entries(restaurantRevenue).map(([id, revenue]) => ({
    id: parseInt(id),
    name: `Restaurant ${id}`,
    revenue
  }));
};

// Calculate average order value
export const getAverageOrderValue = (orders: OrderWithStatus[]) => {
  const paidOrders = orders.filter(order => order.isPaid);
  if (paidOrders.length === 0) return 0;
  
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  return totalRevenue / paidOrders.length;
};

// Get order count by status
export const getOrdersByStatus = (orders: OrderWithStatus[]) => {
  const statusCounts: { [key: string]: number } = {
    'pending': 0,
    'confirmed': 0,
    'preparing': 0,
    'ready': 0,
    'completed': 0,
    'cancelled': 0
  };
  
  orders.forEach(order => {
    if (statusCounts[order.status] !== undefined) {
      statusCounts[order.status]++;
    }
  });
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));
};

// Generate mock intelligence insights based on the data
export const generateAIInsights = (orders: OrderWithStatus[]) => {
  const insights = [];
  
  // Top selling item insight
  const topItems = getTopSellingItems(orders, 1);
  if (topItems.length > 0) {
    insights.push(`Your top selling item is "${topItems[0].name}" with ${topItems[0].count} units sold.`);
  }
  
  // Peak hours insight
  const hourlyData = getRevenueByHour(orders);
  const peakHour = hourlyData.reduce((max, current) => 
    current.revenue > max.revenue ? current : max, { hour: 0, revenue: 0 });
  
  if (peakHour.revenue > 0) {
    const formattedHour = peakHour.hour === 0 ? '12 AM' : 
                         peakHour.hour === 12 ? '12 PM' : 
                         peakHour.hour > 12 ? `${peakHour.hour - 12} PM` : `${peakHour.hour} AM`;
    insights.push(`Your peak business hour is around ${formattedHour}.`);
  }
  
  // Average order value insight
  const avgOrderValue = getAverageOrderValue(orders);
  if (avgOrderValue > 0) {
    insights.push(`Your average order value is ${formatCurrency(avgOrderValue)}.`);
  }
  
  // Restaurant comparison if there are multiple
  const restaurantData = getRevenueByRestaurant(orders);
  if (restaurantData.length > 1) {
    restaurantData.sort((a, b) => b.revenue - a.revenue);
    insights.push(`${restaurantData[0].name} is your top performing location.`);
  }
  
  return insights;
};

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

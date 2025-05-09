
import { v4 as uuidv4 } from "uuid";
import { CartItem, MenuItem, OrderHistoryItem, DeepReadonly } from "@/types";
import { Order, OrderWithStatus, OrderItem } from "./types";
import { getCookieOrLocalStorage } from "./useLocalStorage";
import { isMenuItemAvailable, getDiscountedPrice } from "@/utils/menuManagementUtils";

interface OrderState {
  deviceId: string;
  carts: Record<number, CartItem[]>;
  orders: OrderWithStatus[];
  orderHistory: OrderHistoryItem[];
}

export const createOrderFunctions = (state: DeepReadonly<OrderState>) => {
  // Make a cart into an order (add order id, customer id, etc.)
  const createOrderFromCart = (restaurantId: number): Order => {
    // Get current cart for the specific restaurant
    const currentCart = state.carts[restaurantId] || [];

    // Check if any items in cart are unavailable
    for (const item of currentCart) {
      if (!isMenuItemAvailable(item.id)) {
        throw new Error(`Item ${item.nameEn} is currently unavailable.`);
      }
    }

    // Create order items from cart items
    const orderItems: OrderItem[] = currentCart.map((item) => ({
      id: item.id,
      nameEn: item.nameEn,
      nameJa: item.nameJa,
      price: getDiscountedPrice({ id: item.id, price: item.price } as MenuItem), // Apply any discounts
      quantity: item.quantity,
      imageUrl: item.imageUrl || item.image || "",
    }));

    // Calculate total amount
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create a new order
    const newOrder: Order = {
      id: `order-${uuidv4()}`,
      customerId: state.deviceId,
      restaurantId,
      date: new Date().toISOString(),
      items: orderItems,
      total: totalAmount,
      isPaid: false,
    };

    return newOrder;
  };

  // Create a new order from scratch
  const createOrder = (
    restaurantId: number,
    customerId: string,
    items: OrderItem[]
  ): Order => {
    // Check if any items are unavailable
    for (const item of items) {
      if (!isMenuItemAvailable(item.id)) {
        throw new Error(`Item ${item.nameEn} is currently unavailable.`);
      }
    }

    // Apply any discounts to the items
    const itemsWithDiscounts = items.map(item => ({
      ...item,
      price: getDiscountedPrice({ id: item.id, price: item.price } as MenuItem)
    }));

    // Calculate total amount
    const totalAmount = itemsWithDiscounts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create a new order
    const newOrder: Order = {
      id: `order-${uuidv4()}`,
      customerId,
      restaurantId,
      date: new Date().toISOString(),
      items: itemsWithDiscounts,
      total: totalAmount,
      isPaid: false,
    };

    return newOrder;
  };

  // Get all stored orders from cookies or localStorage
  const getStoredOrders = (): OrderWithStatus[] => {
    const ordersJson = getCookieOrLocalStorage("restaurant_order_history");
    if (!ordersJson) return [];

    try {
      const orderArray = JSON.parse(ordersJson);
      // Initialize status for backward compatibility
      return orderArray.map((order: Order) => ({
        ...order,
        status: order.hasOwnProperty("status")
          ? (order.status as "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled")
          : order.isPaid
          ? "completed" as const
          : "pending" as const,
      }));
    } catch (e) {
      // If parsing fails, return empty array
      return [];
    }
  };

  // Add a new order to the order history
  const addOrder = (newOrder: Order): OrderWithStatus[] => {
    const storedOrders = getStoredOrders();
    const updatedOrders = [...storedOrders, { ...newOrder, status: "pending" as const } as OrderWithStatus];
    localStorage.setItem(
      "restaurant_order_history",
      JSON.stringify(updatedOrders)
    );
    return updatedOrders;
  };

  // Update the status of an order
  const updateOrderStatus = (
    orderId: string, 
    status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  ): OrderWithStatus[] => {
    const storedOrders = getStoredOrders();
    const updatedOrders = storedOrders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem(
      "restaurant_order_history",
      JSON.stringify(updatedOrders)
    );
    return updatedOrders;
  };

  // Confirm an order
  const confirmOrder = (orderId: string): OrderWithStatus[] => {
    return updateOrderStatus(orderId, "confirmed");
  };

  // Mark order as preparing
  const startPreparingOrder = (orderId: string): OrderWithStatus[] => {
    return updateOrderStatus(orderId, "preparing");
  };

  // Mark order as ready
  const markOrderAsReady = (orderId: string): OrderWithStatus[] => {
    return updateOrderStatus(orderId, "ready");
  };

  // Complete an order
  const completeOrder = (orderId: string): OrderWithStatus[] => {
    return updateOrderStatus(orderId, "completed");
  };

  // Cancel an order
  const cancelOrder = (orderId: string): OrderWithStatus[] => {
    return updateOrderStatus(orderId, "cancelled");
  };

  // Mark order as paid
  const completePayment = (
    orderId: string, 
    paymentMethod: 'online' | 'cash'
  ): OrderWithStatus[] => {
    const storedOrders = getStoredOrders();
    const updatedOrders = storedOrders.map((order) =>
      order.id === orderId ? { ...order, isPaid: true, status: 'completed' as const } : order
    );
    localStorage.setItem(
      "restaurant_order_history",
      JSON.stringify(updatedOrders)
    );
    return updatedOrders;
  };

  return {
    createOrderFromCart,
    createOrder,
    getStoredOrders,
    addOrder,
    updateOrderStatus,
    confirmOrder,
    startPreparingOrder,
    markOrderAsReady,
    completeOrder,
    cancelOrder,
    completePayment,
  };
};

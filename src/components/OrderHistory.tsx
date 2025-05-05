
import React from "react";
import { Clock, CreditCard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/orderSystem";
import { formatCurrency } from "@/utils/formatCurrency";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusDetails } from "@/utils/orderStatusUtils";

const OrderHistory: React.FC = () => {
  const { orderHistory, setIsPaymentOpen, getOrderById } = useOrderSystem();

  if (orderHistory.length === 0) {
    return null;
  }

  const totalAmount = orderHistory.reduce((sum, order) => sum + order.total, 0);
  const unpaidOrders = orderHistory.filter((order) => !order.isPaid);

  // Get the latest status from main orders list
  const getLatestOrderStatus = (orderId: string) => {
    const fullOrderDetails = getOrderById(orderId);
    if (fullOrderDetails) {
      // Return full order details from orders array
      return getOrderStatusDetails(fullOrderDetails);
    }
    
    // Fallback to basic order history info
    const historyOrder = orderHistory.find(order => order.id === orderId);
    return historyOrder ? getOrderStatusDetails(historyOrder) : null;
  };

  return (
    <div className="bg-primary/5 py-8 px-4 rounded-lg mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary font-serif">
          Order History
        </h2>
        {unpaidOrders.length > 0 && (
          <Button
            className="bg-secondary hover:bg-secondary/80 text-primary flex items-center gap-2"
            onClick={() => setIsPaymentOpen(1, true)} 
          >
            <CreditCard size={18} />
            Proceed to Payment
          </Button>
        )}
      </div>

      <Separator className="mb-4 bg-primary/10" />

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {orderHistory.map((order) => {
          const statusDetails = getLatestOrderStatus(order.id);
          
          return (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                order.isPaid ? 'border-green-500' : 'border-secondary'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary/70" />
                  <span className="text-sm text-primary/70">
                    {new Date(order.date).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary/70" />
                  {statusDetails && (
                    <Badge className={statusDetails.color}>
                      {statusDetails.label}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator className="my-2 bg-primary/10" />

              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.id}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-primary">
                      {item.quantity} × {item.nameEn}
                    </span>
                    <span className="font-medium text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-semibold">
                <span className="text-primary">Total:</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
              
              {order.chefNote && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
                  <span className="font-medium">Chef Note: </span>
                  {order.chefNote}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg border border-secondary/30">
        <span className="text-lg font-semibold text-primary">
          Total Amount:
        </span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default OrderHistory;

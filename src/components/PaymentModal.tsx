
import React, { useState, useEffect } from "react";
import { X, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";
import Cookies from 'js-cookie';

interface PaymentModalProps {
  restaurantId: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ restaurantId }) => {
  const { getOrderById, isPaymentOpen, setIsPaymentOpen, completePayment, orderHistory } = useOrderSystem();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Find customer's unpaid order for this restaurant
  const unpaidOrders = orderHistory.filter(order => !order.isPaid);
  const order = selectedOrderId ? getOrderById(selectedOrderId) : 
                unpaidOrders.length > 0 ? getOrderById(unpaidOrders[0].id) : null;
  
  const totalAmount = order ? order.total : 0;

  useEffect(() => {
    // Set the first unpaid order as selected when the modal opens
    if (isPaymentOpen[restaurantId] && unpaidOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(unpaidOrders[0].id);
    }
  }, [isPaymentOpen, restaurantId, unpaidOrders, selectedOrderId]);

  const handlePayment = () => {
    if (!paymentMethod || !selectedOrderId) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Auto redirect after payment
      setTimeout(() => {
        completePayment(selectedOrderId, paymentMethod as 'online' | 'cash');
        
        // Update cookie after payment is completed by removing the paid order from the cookie
        const orderHistoryCookie = Cookies.get('restaurant_order_history');
        if (orderHistoryCookie) {
          try {
            const parsedOrders = JSON.parse(orderHistoryCookie);
            // Filter out the paid order
            const remainingUnpaidOrders = parsedOrders.filter(
              (order: any) => order.id !== selectedOrderId
            );
            
            // Update cookie with remaining unpaid orders or remove it if empty
            if (remainingUnpaidOrders.length > 0) {
              Cookies.set('restaurant_order_history', JSON.stringify(remainingUnpaidOrders), { expires: 7 });
            } else {
              Cookies.remove('restaurant_order_history');
            }
          } catch (error) {
            console.error("Error updating order history cookie:", error);
          }
        }
        
        setIsPaymentOpen(restaurantId, false);
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    if (isPaymentOpen[restaurantId]) {
      setPaymentMethod("");
      setIsProcessing(false);
      setIsComplete(false);
    }
  }, [isPaymentOpen, restaurantId]);

  if (!isPaymentOpen[restaurantId]) return null;

  const paymentMethods = [
    { id: "online", name: "Online Payment", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" },
    { id: "cash", name: "Cash Payment", icon: "https://cdn-icons-png.flaticon.com/512/2371/2371970.png" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => !isProcessing && !isComplete && setIsPaymentOpen(restaurantId, false)}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {isComplete ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Thank you for your payment. Redirecting you back...
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-taj-burgundy text-white">
              <div className="flex items-center gap-2">
                <CreditCard size={20} />
                <h2 className="text-xl font-semibold font-serif">Payment</h2>
              </div>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-restaurant-primary/80"
                  onClick={() => setIsPaymentOpen(restaurantId, false)}
                >
                  <X size={20} />
                </Button>
              )}
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-2 text-gray-800">
                  Amount to Pay
                </h3>
                <div className="text-3xl font-bold text-restaurant-primary">
                  {formatCurrency(totalAmount)}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3 text-gray-800">
                  Select Payment Method
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-restaurant-secondary bg-restaurant-secondary/10"
                          : "border-gray-200 hover:border-restaurant-secondary/50"
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={method.icon}
                          alt={method.name}
                          className="max-h-full max-w-full"
                        />
                      </div>
                      <span className="font-medium text-gray-800">
                        {method.name}
                      </span>
                      <div className="ml-auto">
                        <div
                          className={`h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center ${
                            paymentMethod === method.id
                              ? "bg-restaurant-primary border-restaurant-primary"
                              : ""
                          }`}
                        >
                          {paymentMethod === method.id && (
                            <div className="h-3 w-3 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-restaurant-primary hover:bg-restaurant-primary/80 text-white h-12 font-medium"
                disabled={!paymentMethod || isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Pay Now"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

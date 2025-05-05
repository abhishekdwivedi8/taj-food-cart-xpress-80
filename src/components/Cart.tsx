
import React from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderSystem } from "@/context/OrderSystemContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { Separator } from "@/components/ui/separator";

interface CartProps {
  restaurantId: number;
}

const Cart: React.FC<CartProps> = ({ restaurantId }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    isCartOpen,
    setIsCartOpen,
    setIsOrderConfirmOpen,
  } = useOrderSystem();

  const restaurantCart = cartItems[restaurantId] || [];
  const cartTotal = getCartTotal(restaurantId);

  const handleCheckout = () => {
    if (restaurantCart.length === 0) return;
    setIsCartOpen(restaurantId, false);
    setIsOrderConfirmOpen(restaurantId, true);
  };

  if (!isCartOpen[restaurantId]) return null;

  return (
    <div
      className="fixed inset-0 z-50 cart-overlay bg-black/50"
      onClick={() => setIsCartOpen(restaurantId, false)}
    >
      <div
        className="fixed top-0 right-0 w-full sm:w-96 h-full bg-taj-cream shadow-lg animate-slide-in overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-taj-gold/20">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-taj-burgundy" />
            <h2 className="text-xl font-semibold text-taj-burgundy font-serif">Your Cart</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-taj-burgundy hover:bg-taj-burgundy/10"
            onClick={() => setIsCartOpen(restaurantId, false)}
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {restaurantCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-taj-burgundy/70">
              <ShoppingCart size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-2 text-center">
                Add some delicious items from our menu
              </p>
              <Button
                className="mt-6 bg-restaurant-primary hover:bg-restaurant-primary/80 text-white"
                onClick={() => setIsCartOpen(restaurantId, false)}
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurantCart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-2 bg-white rounded-lg shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-taj-burgundy">
                          {item.nameEn}
                        </h3>
                        <p className="text-xs text-taj-burgundy/70">
                          {item.nameHi}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-taj-burgundy/70 hover:text-taj-burgundy"
                        onClick={() => removeFromCart(restaurantId, item.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <p className="font-semibold text-restaurant-secondary">
                        {formatCurrency(item.price)}
                      </p>

                      <div className="flex items-center border border-taj-burgundy/20 rounded">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-taj-burgundy"
                          onClick={() =>
                            updateQuantity(restaurantId, item.id, Math.max(1, item.quantity - 1))
                          }
                        >
                          <span className="text-lg font-bold">-</span>
                        </Button>

                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-taj-burgundy"
                          onClick={() =>
                            updateQuantity(restaurantId, item.id, item.quantity + 1)
                          }
                        >
                          <span className="text-lg font-bold">+</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-taj-gold/20 bg-white">
          <div className="flex justify-between mb-2">
            <span className="text-taj-burgundy">Subtotal</span>
            <span className="font-medium text-taj-burgundy">
              {formatCurrency(cartTotal)}
            </span>
          </div>
          <Separator className="my-2 bg-taj-gold/10" />
          <div className="flex justify-between mb-4">
            <span className="font-semibold text-taj-burgundy">Total</span>
            <span className="font-bold text-taj-burgundy">
              {formatCurrency(cartTotal)}
            </span>
          </div>

          <Button
            className="w-full bg-restaurant-primary hover:bg-restaurant-primary/80 text-white flex items-center justify-center gap-2"
            disabled={restaurantCart.length === 0}
            onClick={handleCheckout}
          >
            Place Order
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;


export const createUIStateFunctions = (
  setIsCartOpenState: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
  setIsOrderConfirmOpenState: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
  setIsOrderSuccessOpenState: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
  setIsPaymentOpenState: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
) => {
  // UI state management
  const setIsCartOpen = (restaurantId: number, isOpen: boolean) => {
    setIsCartOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  const setIsOrderConfirmOpen = (restaurantId: number, isOpen: boolean) => {
    setIsOrderConfirmOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  const setIsOrderSuccessOpen = (restaurantId: number, isOpen: boolean) => {
    setIsOrderSuccessOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  const setIsPaymentOpen = (restaurantId: number, isOpen: boolean) => {
    setIsPaymentOpenState(prev => ({...prev, [restaurantId]: isOpen}));
  };

  return {
    setIsCartOpen,
    setIsOrderConfirmOpen,
    setIsOrderSuccessOpen,
    setIsPaymentOpen
  };
};

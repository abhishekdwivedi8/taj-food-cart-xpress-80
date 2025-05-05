
export const getOrderStatusDetails = (order: any) => {
  if (order.isPaid) {
    return {
      status: 'completed',
      color: 'bg-green-100 text-green-700',
      label: 'Paid & Completed'
    };
  } else if (order.isPrepared) {
    return {
      status: 'prepared',
      color: 'bg-blue-100 text-blue-700',
      label: 'Food Prepared'
    };
  } else if (order.status === 'confirmed') {
    return {
      status: 'confirmed',
      color: 'bg-purple-100 text-purple-700',
      label: 'Order Confirmed'
    };
  } else if (order.status === 'preparing') {
    return {
      status: 'preparing',
      color: 'bg-orange-100 text-orange-700',
      label: 'Preparing Order'
    };
  } else {
    return {
      status: 'processing',
      color: 'bg-yellow-100 text-yellow-700',
      label: 'Processing'
    };
  }
};

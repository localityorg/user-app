export const filterOrders = (orders: any, filter: any) => {
  var data: any = [];

  if (filter.id === 19349) {
    return orders;
  } else {
    if (filter.id === 19345) {
      data = orders.filter((e: any) => e.delivery.isDelivered === true);
    } else if (filter.id === 19348) {
      data = orders.filter((e: any) => e.state.isConfirmed === false);
    } else if (filter.id === 19347) {
      data = orders.filter((e: any) => e.state.isConfirmed === true);
    } else if (filter.id === 19346) {
      data = orders.filter((e: any) => e.state.isCancelled === true);
    }
  }

  return data;
};

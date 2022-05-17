import {SET_USER_ORDERS, SET_LAST_ORDER} from '../actions';

var userOrderState = {
  userOrders: [],
  lastOrder: null,
};

export function ordersReducer(state: any = userOrderState, action: any) {
  switch (action.type) {
    case SET_USER_ORDERS:
      return {...state, userOrders: action.payload};
    case SET_LAST_ORDER:
      return {...state, lastOrder: action.payload};
    default:
      return state;
  }
}

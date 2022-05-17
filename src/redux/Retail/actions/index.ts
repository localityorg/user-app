// delivery type
export const DELIVERY_TYPE = 'DELIVERY_TYPE';

// icart to update
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const EMPTY_CART = 'EMPTY_CART';
export const SET_CART = 'SET_CART';

// all user orders
export const SET_USER_ORDERS = 'SET_USER_ORDERS';
export const SET_LAST_ORDER = 'SET_LAST_ORDER';

// user running accounts
export const SET_RUNNING_ACCOUNTS = 'SET_RUNNING_ACCOUNTS';
export const SET_STORES = 'SET_STORES';

export const setDeliveryType = (delivery: any) => (dispatch: any) => {
  dispatch({
    type: DELIVERY_TYPE,
    payload: delivery,
  });
};

export const setCart = (cart: any) => (dispatch: any) => {
  dispatch({
    type: SET_CART,
    payload: cart,
  });
};

export const addToCart = (itemToAdd: any) => (dispatch: any) => {
  dispatch({
    type: ADD_TO_CART,
    payload: itemToAdd,
  });
};

export const removeFromCart = (itemToRemove: any) => (dispatch: any) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: itemToRemove,
  });
};

export const deleteFromCart = (itemToDelete: any) => (dispatch: any) => {
  dispatch({
    type: DELETE_FROM_CART,
    payload: itemToDelete,
  });
};

export const emptyCart = (cart: any) => (dispatch: any) => {
  dispatch({
    type: EMPTY_CART,
    payload: cart,
  });
};

export const setUserOrders = (orders: any) => (dispatch: any) => {
  dispatch({
    type: SET_USER_ORDERS,
    payload: orders,
  });
};

export const setLastUserOrder = (order: any) => (dispatch: any) => {
  dispatch({
    type: SET_LAST_ORDER,
    payload: order,
  });
};

export const setRunningAccounts = (accounts: any) => (dispatch: any) => {
  dispatch({
    type: SET_RUNNING_ACCOUNTS,
    payload: accounts,
  });
};

export const setStores = (stores: any) => (dispatch: any) => {
  dispatch({
    type: SET_STORES,
    payload: stores,
  });
};

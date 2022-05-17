import {ADD_TO_CART, REMOVE_FROM_CART, EMPTY_CART, SET_CART, DELETE_FROM_CART} from '../actions';

var cartState: any = {
  tempCart: [],
  cart: [],
};

const sortCart = (cart: any) => {
  var tempArray: any[] = [];
  var sortedCart: any[] = [];

  cart?.forEach((item: any) => {
    var i = tempArray.findIndex(x => x.id == item.id);
    if (i <= -1) {
      tempArray.push(item);
    }
  });

  tempArray.map((obj: any) => {
    const count = cart.filter((e: any) => e.id === obj.id).length;

    const totalItemPrice = count * parseFloat(obj.price.mrp);
    sortedCart.push({
      ...obj,
      itemQuantity: count.toString(),
      totalPrice: totalItemPrice.toString(),
    });
  });

  return sortedCart;
};

function addToCart(fetchedData: any) {
  const itemToAdd = {
    id: fetchedData.id,
    name: fetchedData.name,
    brand: fetchedData.brand,
    quantity: fetchedData.quantity,
    imageUrl: fetchedData.imageUrl,
    price: fetchedData.price,
  };
  cartState.tempCart.push(itemToAdd);
  const cart = [...cartState.tempCart];
  return sortCart(cart);
}

function removeFromCart(fetchedData: any) {
  const cart = [...cartState.tempCart];
  if (cart.find(e => e.id === fetchedData.id) !== undefined) {
    const indEx = cart.findIndex(e => e.id === fetchedData.id);
    cart.splice(indEx, 1);
    cartState.tempCart = cart;
  }
  return sortCart(cart);
}

function deleteFromCart(fetchedData: any) {
  const cart = [...cartState.cart];
  if (cart.find(e => e.id === fetchedData.id) !== undefined) {
    const indEx = cart.findIndex(e => e.id === fetchedData.id);
    cart.splice(indEx, 1);
    cartState.tempCart = cart;
  }
  return sortCart(cart);
}

function emptyCart() {
  cartState.tempCart = [];
  return true;
}

export function cartReducer(state: any = cartState, action: any) {
  switch (action.type) {
    case SET_CART:
      const cartValue = sortCart(action.payload);
      return {...state, cart: cartValue};
    case ADD_TO_CART:
      const updatedCart = addToCart(action.payload);
      return {...state, cart: updatedCart};
    case REMOVE_FROM_CART:
      const newItemCart = removeFromCart(action.payload);
      return {...state, cart: newItemCart};
    case DELETE_FROM_CART:
      const deletedItemCart = deleteFromCart(action.payload);
      return {...state, cart: deletedItemCart};
    case EMPTY_CART:
      emptyCart();
      return {...state, cart: action.payload};
    default:
      return state;
  }
}

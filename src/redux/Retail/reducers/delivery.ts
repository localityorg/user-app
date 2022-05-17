import {DELIVERY_TYPE} from '../actions';

var deliveryState = {
  delivery: {},
};

export function deliveryReducer(state: any = deliveryState, action: any) {
  switch (action.type) {
    case DELIVERY_TYPE:
      return {...state, delivery: action.payload};
    default:
      return state;
  }
}

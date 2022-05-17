import {SET_STORES} from '../actions';

var storeState = {
  stores: null,
};

export function storesReducer(state = storeState, action: any) {
  switch (action.type) {
    case SET_STORES:
      return {...state, stores: action.payload};
    default:
      return state;
  }
}

import {SET_RIDES} from '../actions';

var rideState = {
  rides: null,
};

export function ridesReducer(state = rideState, action: any) {
  switch (action.type) {
    case SET_RIDES:
      return {...state, rides: action.payload};
    default:
      return state;
  }
}

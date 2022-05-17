import {SET_TRIP, SET_DESTINATION, SET_ORIGIN} from '../actions';

var tripState = {
  origin: null,
  destination: null,
  lastTrip: null,
};

export function tripReducer(state: any = tripState, action: any) {
  switch (action.type) {
    case SET_TRIP:
      return {...state, lastTrip: action.payload};
    case SET_ORIGIN:
      return {...state, origin: action.payload};
    case SET_DESTINATION:
      return {...state, destination: action.payload};
    default:
      return state;
  }
}

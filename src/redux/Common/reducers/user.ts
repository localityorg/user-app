import {SET_USER, REMOVE_USER} from '../actions';

var userState = {
  user: null,
};

export function userReducer(state: any = userState, action: any) {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.payload};
    case REMOVE_USER:
      return {...state, user: null};
    default:
      return state;
  }
}

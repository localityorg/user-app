import {SET_RUNNING_ACCOUNTS} from '../actions';

var accountState = {
  accounts: null,
};

export function accountsReducer(state = accountState, action: any) {
  switch (action.type) {
    case SET_RUNNING_ACCOUNTS:
      return {...state, accounts: action.payload};
    default:
      return state;
  }
}

import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {userReducer} from './Common/reducers/user';
import {locationReducer} from './Common/reducers/location';

import {cartReducer} from './Retail/reducers/cart';
import {ordersReducer} from './Retail/reducers/orders';
import {deliveryReducer} from './Retail/reducers/delivery';
import {storesReducer} from './Retail/reducers/stores';
import {accountsReducer} from './Retail/reducers/accounts';

import {ridesReducer} from './Ride/reducers/rides';
import {tripReducer} from './Ride/reducers/trips';

const rootReducer = combineReducers({
  cartReducer,
  userReducer,
  storesReducer,
  locationReducer,
  ordersReducer,
  deliveryReducer,
  accountsReducer,
  ridesReducer,
  tripReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));

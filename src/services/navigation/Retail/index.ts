import {ModalScreenLayouts, ScreenLayouts, TabScreenLayouts} from './types';

import Main from '../../../screens/Retail/index';
import Cart from '../../../screens/Retail/Cart';
import AllOrders from '../../../screens/Retail/AllOrders';

import Checkout from '../../../screens/Retail/Checkout';
import Track from '../../../screens/Retail/Track';

import {genRootNavigator, genStackNavigator, genTabNavigator} from './help';
import {screenDefaultOptions, tabBarDefaultOptions} from '../options';
import SearchScreen from '../../../screens/Retail/Search';

// Describe your screens here
export type Tabs = 'RetailMainTab' | 'CartTab' | 'AllOrdersTab';
export type Modals = 'RetailTrack' | 'RetailCheckout';
export type Screen = 'RetailMain' | 'Cart' | 'AllOrders' | 'SearchRetail';

// Screens
const screens: ScreenLayouts = {
  RetailMain: {
    name: 'RetailMain',
    component: Main,
    options: () => ({
      title: 'Home',
      ...screenDefaultOptions(),
    }),
  },
  Cart: {
    name: 'Cart',
    component: Cart,
    options: () => ({
      title: 'Cart',
      ...screenDefaultOptions(),
    }),
  },
  AllOrders: {
    name: 'AllOrders',
    component: AllOrders,
    options: () => ({
      title: 'AllOrders',
      ...screenDefaultOptions(),
    }),
  },
  SearchRetail: {
    name: 'SearchRetail',
    component: SearchScreen,
    options: () => ({
      title: 'AllOrders',
      ...screenDefaultOptions(),
    }),
  },
};

const HomeStack = () => genStackNavigator([screens.RetailMain, screens.SearchRetail, screens.Cart]);
const CartStack = () => genStackNavigator([screens.Cart, screens.SearchRetail]);
const AllOrdersStack = () => genStackNavigator([screens.AllOrders]);

// Tabs
const tabs: TabScreenLayouts = {
  RetailMainTab: {
    name: 'RetailMainTab',
    component: HomeStack,
    options: () => ({
      title: 'Home',
      ...tabBarDefaultOptions('Retail'),
    }),
  },
  CartTab: {
    name: 'CartTab',
    component: CartStack,
    options: () => ({
      title: 'Cart',
      ...tabBarDefaultOptions('Cart'),
    }),
  },
  AllOrdersTab: {
    name: 'AllOrdersTab',
    component: AllOrdersStack,
    options: () => ({
      title: 'AllOrders',
      lazy: false,
      ...tabBarDefaultOptions('AllOrders'),
    }),
  },
};

const TabNavigator = () => genTabNavigator([tabs.RetailMainTab, tabs.CartTab, tabs.AllOrdersTab]);

// Modals
const modals: ModalScreenLayouts = {
  RetailTrack: {
    name: 'RetailTrack',
    component: Track,
    options: () => ({
      title: 'Track',
    }),
  },
  RetailCheckout: {
    name: 'RetailCheckout',
    component: Checkout,
    options: () => ({
      title: 'Checkout',
    }),
  },
};

// Root Navigator
export const RetailRootNavigator = (): JSX.Element =>
  genRootNavigator(TabNavigator, [modals.RetailTrack, modals.RetailCheckout]);

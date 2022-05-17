import {ModalScreenLayouts, ScreenLayouts, TabScreenLayouts} from './types';

import Main from '../../../screens/Ride/index';
import Trips from '../../../screens/Ride/Trips';

import Checkout from '../../../screens/Ride/Checkout';
import Track from '../../../screens/Ride/Track';

import {genRootNavigator, genStackNavigator, genTabNavigator} from './help';
import {screenDefaultOptions, tabBarDefaultOptions} from '../options';

// Describe your screens here
export type Tabs = 'RideMain' | 'TripsTab';
export type Modals = 'RideTrack' | 'RideCheckout';
export type Screens = 'RideMain' | 'Trips';

// Screens
const screens: ScreenLayouts = {
  RideMain: {
    name: 'RideMain',
    component: Main,
    options: () => ({
      title: 'Home',
      ...screenDefaultOptions(),
    }),
  },
  Trips: {
    name: 'Trips',
    component: Trips,
    options: () => ({
      title: 'Trips',
      ...screenDefaultOptions(),
    }),
  },
};

const HomeStack = () => genStackNavigator([screens.RideMain]);
const TripsStack = () => genStackNavigator([screens.Trips]);

// Tabs
const tabs: TabScreenLayouts = {
  RideMain: {
    name: 'RideMainTab',
    component: HomeStack,
    options: () => ({
      title: 'Home',
      ...tabBarDefaultOptions('Ride'),
    }),
  },
  TripsTab: {
    name: 'TripsTab',
    component: TripsStack,
    options: () => ({
      title: 'Trips',
      lazy: false,
      ...tabBarDefaultOptions('Trips'),
    }),
  },
};

const TabNavigator = () => genTabNavigator([tabs.RideMain, tabs.TripsTab]);

// Modals
const modals: ModalScreenLayouts = {
  RideTrack: {
    name: 'Track',
    component: Track,
    options: () => ({
      title: 'Track',
    }),
  },
  RideCheckout: {
    name: 'Checkout',
    component: Checkout,
    options: () => ({
      title: 'Checkout',
    }),
  },
};

// Root Navigator
export const RideRootNavigator = (): JSX.Element =>
  genRootNavigator(TabNavigator, [modals.RideTrack, modals.RideCheckout]);

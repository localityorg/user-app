import {ScreenLayouts} from './types';

import Home from '../../../screens/Home';
import Profile from '../../../screens/Home/Profile';
import Addresses from '../../../screens/Home/Addresses';

import {RetailRootNavigator} from '../Retail';
import {RideRootNavigator} from '../Ride';

import Splash from '../../../screens/Auth/Splash';
import {Onboarding} from '../../../screens/Auth/Onboarding';
import Login from '../../../screens/Auth/Login';
import Register from '../../../screens/Auth/Register';

import {genRootNavigator, genStackNavigator} from './help';
import {screenDefaultOptions} from '../options';
import Accounts from '../../../screens/Home/Accounts';

// Describe your screens here
export type Screen =
  | 'Splash'
  | 'Onboarding'
  | 'Login'
  | 'Register'
  | 'Main'
  | 'Profile'
  | 'Accounts'
  | 'Addresses'
  | 'Retail'
  | 'Ride';
export type Tabs = 'Main';

// Screens
const screens: ScreenLayouts = {
  Splash: {
    name: 'Splash',
    component: Splash,
    options: () => ({
      title: 'Splash',
      ...screenDefaultOptions(),
    }),
  },
  Onboarding: {
    name: 'Onboarding',
    component: Onboarding,
    options: () => ({
      title: 'Home',
      ...screenDefaultOptions(),
    }),
  },
  Login: {
    name: 'Login',
    component: Login,
    options: () => ({
      title: 'Login',
      ...screenDefaultOptions(),
    }),
  },
  Register: {
    name: 'Register',
    component: Register,
    options: () => ({
      title: 'Register',
      ...screenDefaultOptions(),
    }),
  },
  Main: {
    name: 'Main',
    component: Home,
    options: () => ({
      title: 'Home',
      ...screenDefaultOptions(),
    }),
  },
  Profile: {
    name: 'Profile',
    component: Profile,
    options: () => ({
      title: 'Home',
      ...screenDefaultOptions(),
    }),
  },
  Addresses: {
    name: 'Addresses',
    component: Addresses,
    options: () => ({
      title: 'Addresses',
      ...screenDefaultOptions(),
    }),
  },
  Accounts: {
    name: 'Accounts',
    component: Accounts,
    options: () => ({
      title: 'Accounts',
      ...screenDefaultOptions(),
    }),
  },
  Retail: {
    name: 'Retail',
    component: RetailRootNavigator,
    options: () => ({
      title: 'Retail',
      ...screenDefaultOptions(),
    }),
  },
  Ride: {
    name: 'Ride',
    component: RideRootNavigator,
    options: () => ({
      title: 'Ride',
      ...screenDefaultOptions(),
    }),
  },
};

const HomeStack = () =>
  genStackNavigator([
    screens.Splash,
    screens.Onboarding,
    screens.Login,
    screens.Register,
    screens.Main,
    screens.Profile,
    screens.Addresses,
    screens.Accounts,
    screens.Retail,
    screens.Ride,
  ]);

// Root Navigator
export const RootNavigator = (): JSX.Element => genRootNavigator(HomeStack);

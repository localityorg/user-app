import React from 'react';
import {Platform} from 'react-native';
import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {Colors} from 'react-native-ui-lib';

import {Icon} from '../../components/icon';

export const screenDefaultOptions = (): NativeStackNavigationOptions => ({
  headerShadowVisible: false,
  headerShown: false,
  headerTintColor: Colors.primary,

  // this setup makes large title work on iOS
  ...Platform.select({
    ios: {
      headerLargeTitle: true,
      headerTransparent: true,
    },
  }),
});

export const tabBarDefaultOptions = (routeName: string): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.grey40,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: Colors.bgColor,
    borderTopWidth: 0,
    elevation: 0,
  },
  tabBarHideOnKeyboard: true,
  tabBarIcon: ({focused, color, size}) => {
    return <Icon name={getIconName(routeName, focused)} size={size} color={color} />;
  },
});

const getIconName = (routeName: string, focused: boolean): string => {
  // Main App
  if (routeName === 'Main') {
    return focused ? 'grid' : 'grid-outline';
  }
  if (routeName === 'Profile') {
    return focused ? 'person' : 'person-outline';
  }

  // Retail App
  if (routeName === 'Retail') {
    return focused ? 'basket' : 'basket-outline';
  }
  if (routeName === 'Cart') {
    return focused ? 'cart' : 'cart-outline';
  }
  if (routeName === 'AllOrders') {
    return focused ? 'newspaper' : 'newspaper-outline';
  }

  // Rides
  if (routeName === 'Ride') {
    return focused ? 'pin' : 'pin-outline';
  }
  if (routeName === 'Trips') {
    return focused ? 'map' : 'map-outline';
  }

  return 'list';
};

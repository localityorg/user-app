import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {Modals, Screen, Tabs} from './index';

type BaseScreenInfo = {
  name: string;
  component: React.FC<any>;
  // component: React.FC<NativeStackScreenProps<ScreenProps, Screen>>; // idk why it doesn't work
};

type ScreenInfo = BaseScreenInfo & {
  options: () => NativeStackNavigationOptions;
};

// base
export type ScreenLayouts = {
  [key in Screen]: ScreenInfo;
};
export type GenStackNavigatorProps = ScreenInfo[];

// tabs
export type TabScreenInfo = BaseScreenInfo & {
  options: () => BottomTabNavigationOptions;
};
export type TabScreenLayouts = {
  [key in Tabs]: TabScreenInfo;
};
export type GenTabNavigatorProps = TabScreenInfo[];

// modals
export type ModalScreenInfo = ScreenInfo;
export type ModalScreenLayouts = {
  [key in Modals]: ScreenInfo;
};

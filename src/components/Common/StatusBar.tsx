import React from 'react';
import {StatusBar} from 'react-native';
import {Colors} from 'react-native-ui-lib';

import {getNavigationTheme} from '../../utils/designSystem';

export default function DynamicStatusBar() {
  const colorScheme = getNavigationTheme();

  return (
    <StatusBar
      barStyle={colorScheme.dark ? 'light-content' : 'dark-content'}
      backgroundColor={Colors.transparent}
    />
  );
}

import React from 'react';
import {ActivityIndicator} from 'react-native';

import SkeletonContent from 'react-native-skeleton-content';

import {View} from '../../Common/Themed';
import {CommonStyles} from '../../Common/Elements';

export function CreateOrderLoader() {
  return (
    <View style={CommonStyles.loadingContainer}>
      <ActivityIndicator color="#1ea472" size="large" />
    </View>
  );
}

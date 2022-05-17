import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {SIZES} from '../../utils/constants';

import {BoldText, Text} from './Themed';

interface LogoProps {
  onPress?: any;
  size?: number;
}

export default function Logo(props: LogoProps) {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={SIZES.opacity.active}>
      <BoldText style={{color: Colors.tint, fontSize: SIZES.font.header}}>locality.</BoldText>
    </TouchableOpacity>
  );
}

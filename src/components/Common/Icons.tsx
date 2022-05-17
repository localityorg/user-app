import React from 'react';
import {View, BoldText} from './Themed';

import useColorScheme from '../../hooks/useColorScheme';

import {SIZES} from './Elements';
import {Colors} from 'react-native-ui-lib';

interface IconsProps {
  data: any;
}

export default function Icons(props: IconsProps) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {props.data.map((obj: any, index: number) => (
        <View
          style={{
            height: 38,
            width: 38,
            backgroundColor: Colors.$backgroundDisabled,
            borderWidth: 2,
            borderColor: Colors.$backgroundDefault,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            marginLeft: index * 39,
          }}
        >
          <BoldText style={{fontSize: SIZES.font.text}}>{obj.name.splice(1, 2)}</BoldText>
        </View>
      ))}
    </View>
  );
}

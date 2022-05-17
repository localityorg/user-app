import React from 'react';
import {ImageBackground, TouchableOpacity} from 'react-native';
import {View, Text, BoldText} from '../Common/Themed';

import {ImageLoader} from 'react-native-image-fallback';
import {networkUrls, SIZES} from '../../utils/constants';
import {Colors} from 'react-native-ui-lib';

interface HomeIconProps {
  onNav: any;
  icon: string;
  name: string;
  frozen?: boolean;
}

export default function HomeIcon(props: HomeIconProps) {
  const url = networkUrls();

  return (
    <View style={{overflow: 'hidden'}}>
      {props.frozen && (
        <ImageBackground
          source={{uri: props.icon}}
          style={{height: 100, width: 100, marginRight: 15}}
          blurRadius={100}
          height={100}
          width={100}
        />
      )}
      <TouchableOpacity
        style={{
          position: props.frozen ? 'absolute' : 'relative',
          height: 100,
          width: 100,
          padding: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginRight: 15,
          borderRadius: 5,
          backgroundColor: props.frozen ? 'transparent' : Colors.$backgroundNeutralMedium,
        }}
        onPress={props.onNav}
        activeOpacity={SIZES.opacity.thumbnail}
      >
        <ImageLoader
          source={`${props.icon}`}
          fallback={[`${url.ICON_URI}imagedefault.png`]}
          style={{
            height: 50,
            width: 50,
            borderRadius: 10,
          }}
        />
        <BoldText style={{fontSize: SIZES.font.title}}>{props.name}</BoldText>
      </TouchableOpacity>
    </View>
  );
}

{
}

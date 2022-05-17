import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Text} from '../../Common/Themed';
import {Ionicons} from '@expo/vector-icons';

interface CartIconProps {
  length: number;
  onPress: any;
}

export default function CartIcon(props: CartIconProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      delayPressIn={0}
      style={{
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: props.length > 0 ? 'center' : 'flex-end',
      }}
      disabled={props.length > 0 ? false : true}
    >
      {props.length > 0 && (
        <View
          style={{
            position: 'absolute',
            height: 24,
            width: 24,
            top: 0,
            right: 0,
            zIndex: 999,
            backgroundColor: '#1ea472',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{color: '#fff'}}>{props.length}</Text>
        </View>
      )}
      <Ionicons name="cart-outline" size={25} color={props.length > 0 ? '#1ea472' : '#111'} />
    </TouchableOpacity>
  );
}

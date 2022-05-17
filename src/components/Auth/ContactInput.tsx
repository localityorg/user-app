import React from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import {SIZES} from '../../utils/constants';
import {AntDesign} from '@expo/vector-icons';

import {View, Text, BoldText, TextInput} from '../Common/Themed';
import {Colors} from 'react-native-ui-lib';

interface ContactInputProps {
  contact: {
    ISD: string;
    number: string;
  };
  setContact: any;
  onNext: any;
  loading: boolean;
  lock?: boolean;
  autoFocus?: boolean;
}

export default function ContactInput(props: ContactInputProps) {
  return (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        marginVertical: 10,
        height: 67,
      }}
    >
      <BoldText style={{fontSize: SIZES.font.small}}>Contact Number</BoldText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            width: 60,
          }}
          disabled={props.lock || false}
        >
          <Text style={{fontSize: SIZES.font.header}}>{props.contact.ISD}</Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginLeft: 10,
            flex: 1,
            marginTop: 5,
          }}
        >
          <TextInput
            editable={props.lock || true}
            value={props.contact.number}
            onChangeText={props.setContact}
            keyboardType="phone-pad"
            maxLength={10}
            style={{fontSize: SIZES.font.header, backgroundColor: 'transparent', lineHeight: 40}}
            placeholderTextColor={Colors.tabIconDefault}
            placeholder="999900000"
            selectionColor={Colors.tint}
            autoFocus={props.autoFocus || false}
          />
        </View>
        {props.contact.number.length === 10 && (
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={props.onNext}
            disabled={props.lock || false}
          >
            {props.loading ? (
              <ActivityIndicator color={Colors.tint} size="large" />
            ) : (
              <AntDesign name="right" color={Colors.tint} size={SIZES.icon.header} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

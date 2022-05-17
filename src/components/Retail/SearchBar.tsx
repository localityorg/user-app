import React from 'react';
import {TouchableOpacity} from 'react-native';
import {SIZES} from '../../utils/constants';
import {CommonStyles} from '../Common/Elements';
import {Text, TextInput, View} from '../Common/Themed';

import {AntDesign, Ionicons} from '@expo/vector-icons';
import {Colors} from 'react-native-ui-lib';

interface SearchBarProps {
  placeholder: string;
  value?: any;
  onChange?: any;
  onClick?: any;
  autoFocus?: boolean;
  nav?: any;
}

export function SearchBar(props: SearchBarProps) {
  if (props.nav) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          alignSelf: 'flex-start',
          marginBottom: 10,
          backgroundColor: 'transparent',
        }}
      >
        <TouchableOpacity
          style={{
            ...CommonStyles.search,
            backgroundColor: Colors.$backgroundDisabled,
          }}
          activeOpacity={SIZES.opacity.active}
          delayPressIn={0}
          onPress={props.nav}
        >
          <AntDesign name="search1" color={Colors.text} size={20} />
          <View style={CommonStyles.searchInput}>
            <Text style={{fontSize: SIZES.font.text, color: Colors.$textNeutral}}>
              Search products
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'flex-start',
        marginBottom: 10,
        backgroundColor: 'transparent',
      }}
    >
      <View
        style={{
          ...CommonStyles.search,
          backgroundColor: Colors.$backgroundDisabled,
        }}
      >
        {props.value.length === 0 && (
          <AntDesign name="search1" color={Colors.inputtext} size={SIZES.icon.normal} />
        )}
        <TextInput
          style={{
            ...CommonStyles.searchInput,
            color: Colors.$text,
          }}
          value={props.value}
          onChangeText={text => {
            props.onChange(text);
          }}
          placeholder={props.placeholder || 'search'}
          placeholderTextColor={Colors.$textNeutral}
          autoFocus={props.autoFocus || false}
          selectionColor={Colors.tint}
        />
        {props.value.length !== 0 && (
          <TouchableOpacity
            onPress={() => {
              props.onChange('');
            }}
          >
            <Ionicons name="close-outline" color={Colors.inputtext} size={SIZES.icon.normal} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

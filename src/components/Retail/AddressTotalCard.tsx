import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import useColorScheme from '../../hooks/useColorScheme';

import {View, BoldText} from '../Common/Themed';

interface CardProps {
  deliveryAddress: any;
  onPress?: any;
  disabled: boolean;
  grandTotal: string;
  loading?: boolean;
}

export default function AddressTotalCard(props: CardProps) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        ...styles.container,
        borderWidth: props.disabled ? 0 : 1,
        paddingTop: props.disabled ? 0 : 10,
        paddingBottom: props.disabled ? 15 : 10,
      }}
    >
      <TouchableOpacity style={styles.section} onPress={props.onPress} disabled={props.disabled}>
        <BoldText style={styles.sectionHeader}>Address</BoldText>
        {props.deliveryAddress && (
          <BoldText
            style={{
              fontSize: 14,
            }}
            numberOfLines={props.disabled ? 2 : 3}
          >
            {props.deliveryAddress.line1}, {props.deliveryAddress.line2}
          </BoldText>
        )}
      </TouchableOpacity>
      <View style={{...styles.seperator, backgroundColor: Colors.$backgroundDisabled}} />
      <View style={styles.section}>
        <BoldText style={styles.sectionHeader}>Grand Total</BoldText>
        {props.loading ? (
          <ActivityIndicator color="#1ea472" style={{height: 22}} />
        ) : (
          <BoldText
            style={{
              fontSize: 20,
            }}
          >
            ₹ {props.grandTotal}/-
          </BoldText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  section: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  seperator: {
    alignSelf: 'center',
    height: '80%',
    width: 1,
    marginHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 15,
    marginBottom: 5,
    color: '#666',
    textTransform: 'uppercase',
  },
});

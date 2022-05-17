import moment from 'moment';
import React from 'react';
import {StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {BoldText, View, Text} from '../../Common/Themed';

const {width: totalWidth} = Dimensions.get('window');
const cursorWidth = (totalWidth * 0.9) / 4;

interface DeliverySlider {
  onPress: any;
  active: any;
  data: any;
}

export default function DeliveryTime(props: DeliverySlider) {
  return (
    <>
      <View style={styles.container}>
        {props.data.map((obj: any) => (
          <TouchableOpacity
            style={{
              width: cursorWidth * 0.95,
              height: 40,
              borderRadius: props.active === obj ? 10 : 0,
              backgroundColor: props.active === obj ? '#fff' : '#ddd',
              shadowColor: props.active === obj ? '#000' : 'transparent',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: props.active === obj ? 5 : 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            delayPressIn={0}
            key={obj.n}
            onPress={() => props.onPress(obj)}
          >
            <BoldText
              style={{
                color: props.active === obj ? '#111' : '#555',
              }}
            >
              {obj.type}
            </BoldText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{backgroundColor: 'transparent'}}>
        <Text>
          {props.active.text}{' '}
          <BoldText>
            {moment(Date.now() + parseFloat(props.active.n)).format('ddd, hh:mm A')}
          </BoldText>
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#d2d2d2',
    backgroundColor: '#ddd',
  },
});

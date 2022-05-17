import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {View, BoldText, Text} from '../../Common/Themed';
import {CommonStyles, LoadingContainer, Section} from '../../Common/Elements';
import {ImageLoader} from 'react-native-image-fallback';

import {networkUrls} from '../../../utils/constants';
import useColorScheme from '../../../hooks/useColorScheme';
import {Colors} from 'react-native-ui-lib';

interface CardProps {
  onPress: any;
  active: any;
  data?: any;
  meta?: any;
  storeId?: any;
}

export function PaymentOption({onPress, data, active, store}: any) {
  const urls = networkUrls();
  const colorScheme = useColorScheme();

  return data ? (
    <View style={{backgroundColor: 'transparent'}}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: '100%',
          padding: 10,
          paddingLeft: 15,
          height: 60,
          borderRadius: 5,
          marginBottom: 5,
          borderColor: active ? 'transparent' : Colors.buttonbg,
          backgroundColor: active ? Colors.buttonbg : 'transparent',
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: data.active ? 1 : 0,
        }}
        disabled={!data.active || (data.mode === 'KHATA' && !store)}
      >
        <ImageLoader
          source={
            colorScheme === 'dark' ? `${urls.ICON_URI}${data.uri1}` : `${urls.ICON_URI}${data.uri}`
          }
          fallback={[`${urls.ICON_URI}imagedefault.png`]}
          style={{
            height: 30,
            width: 30,
            borderRadius: 10,
            marginRight: 10,
          }}
        />

        <BoldText style={{color: Colors.text}}>
          {data.mode}{' '}
          {!data.active && (
            <Text
              style={{
                fontWeight: '400',
                textTransform: 'none',
              }}
            >
              (disabled)
            </Text>
          )}
        </BoldText>
      </TouchableOpacity>
    </View>
  ) : (
    <View />
  );
}

export default function PaymentOptions(props: CardProps) {
  if (props.data === null) {
    return <LoadingContainer />;
  }
  if (props.data.length < 1) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <BoldText>Error getting available Payment methods.</BoldText>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {props.data.map((obj: any) => (
        <Section
          key={obj.title}
          title={obj.title}
          // subtitle={obj.subtext}
          body={obj.data.map((payobj: any) => (
            <>
              <PaymentOption
                onPress={() => props.onPress(payobj)}
                data={payobj}
                active={props.active === payobj}
                key={payobj.mode}
                store={props.storeId}
              />
              {props.active === payobj && (
                <Text style={{marginBottom: 5}}>{props.active.text}</Text>
              )}
            </>
          ))}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});

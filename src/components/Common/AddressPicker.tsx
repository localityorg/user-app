import React, {useEffect, useState} from 'react';

import {TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {AntDesign, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';

import {Button, CategoryBtn, CommonStyles, InputText, Screen} from '../Common/Elements';
import {BoldText, Text, View} from '../Common/Themed';
import DynamicStatusBar from '../Common/StatusBar';

import {darkMapStyle, lightMapStyle} from '../../constants/MapStyle';
import {validateDeliveryAddress} from '../../utils/validators';
import {useDispatch} from 'react-redux';
import {setUserLocation} from '../../redux/Common/actions';
import {SIZES} from '../../utils/constants';
import useColorScheme from '../../hooks/useColorScheme';
import {Colors} from 'react-native-ui-lib';

const tags = [
  {
    key: 16545354,
    name: 'Home',
  },
  {
    key: 14653454,
    name: 'Office',
  },
  {
    key: 55432455,
    name: 'Friend',
  },
  {
    key: 12521453,
    name: 'Another Home',
  },
];

interface PickerProps {
  onBack: any;
  delivery: any;
  setDelivery: any;
  onNext: any;
  loading: boolean;
}

export default function AddressPicker(props: PickerProps) {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  // render map
  const [renderMap, setRenderMap] = useState<boolean>(false);

  // location
  const [location, setLocation] = useState<any | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

  const [isValid, setIsValid] = useState<boolean>(false);

  const mapWidth = SIZES.screen.width * 0.9;
  const mapHeight = SIZES.screen.height * 0.9;

  const askForLocationPermission = () => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      setLocationPermission(status ? 'granted' : 'denied');

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
        });
      }
    })();
  };

  useEffect(() => {
    askForLocationPermission();
  }, []);

  useEffect(() => {
    const {valid} = validateDeliveryAddress(props.delivery);
    setIsValid(valid);
  }, [props.delivery]);

  if (locationPermission === null) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <BoldText style={CommonStyles.title}>
          Requesting location permissions to track location
        </BoldText>
      </View>
    );
  }

  return (
    <>
      <DynamicStatusBar />
      <Screen>
        <View style={CommonStyles.header}>
          <TouchableOpacity onPress={props.onBack}>
            <AntDesign name="back" size={SIZES.icon.header} color={Colors.text} />
          </TouchableOpacity>

          <BoldText style={CommonStyles.title}>New Address</BoldText>
        </View>

        {!renderMap ? (
          <View style={styles.inputContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <InputText
                title="Name"
                placeholder="Name"
                value={props.delivery.name}
                onChange={(text: string) =>
                  props.setDelivery({
                    ...props.delivery,
                    name: text,
                  })
                }
                mini={true}
              />

              <InputText
                placeholder="Pincode"
                title="Pincode"
                keyboardType="phone-pad"
                value={props.delivery.pincode}
                onChange={(text: string) =>
                  props.setDelivery({
                    ...props.delivery,
                    pincode: text,
                  })
                }
                mini={true}
              />
            </View>
            <InputText
              placeholder="Building / Block"
              value={props.delivery.line1}
              autoCorrect={false}
              onChange={(text: string) =>
                props.setDelivery({
                  ...props.delivery,
                  line1: text,
                })
              }
              title="Building / Block"
            />

            <InputText
              placeholder="Street / Road"
              title="Street / Road"
              value={props.delivery.line2}
              autoCorrect={false}
              onChange={(text: string) =>
                props.setDelivery({
                  ...props.delivery,
                  line2: text,
                })
              }
            />

            <View style={{marginTop: 5}}>
              <FlatList
                data={tags}
                keyExtractor={e => e.key.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <CategoryBtn
                    active={item.name === props.delivery.name}
                    onPress={() =>
                      props.setDelivery({
                        ...props.delivery,
                        name: item.name,
                      })
                    }
                    text={item.name}
                  />
                )}
              />
            </View>

            <Button
              label="Confirm Address"
              fullWidth={true}
              disabled={!isValid}
              onPress={() => setRenderMap(true)}
            />
          </View>
        ) : (
          <View style={{flex: 1, width: '100%'}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                shadowColor: Colors.buttonbg,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                marginTop: 10,
                borderRadius: 10,
                position: 'absolute',
                alignSelf: 'center',

                zIndex: 99,
              }}
            >
              <View
                style={{
                  marginHorizontal: 10,
                  backgroundColor: 'transparent',
                  flex: 1,
                }}
              >
                <BoldText style={{fontSize: 16}}>{props.delivery.name}</BoldText>
                <Text numberOfLines={1}>
                  {props.delivery.line1} {props.delivery.line2}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setRenderMap(false)}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={SIZES.icon.normal}
                  color={Colors.text}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                ...styles.mapStyle,
                height: mapHeight,
                width: mapWidth,
              }}
            >
              <MapView
                initialRegion={{
                  latitude: parseFloat(location?.latitude),
                  longitude: parseFloat(location?.longitude),
                  latitudeDelta: 0.0011,
                  longitudeDelta: 0.0018,
                }}
                provider={PROVIDER_DEFAULT}
                customMapStyle={colorScheme === 'light' ? lightMapStyle : darkMapStyle}
                style={{flex: 1}}
                onRegionChangeComplete={e => {
                  setUserLocation({
                    latitude: e.latitude.toString(),
                    longitude: e.longitude.toString(),
                  });
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: '42.7%',
                  left: '45%',
                  backgroundColor: 'transparent',
                }}
              >
                <Ionicons name="location-sharp" color={Colors.text} size={SIZES.icon.header} />
              </View>
            </View>

            <View
              style={{
                ...CommonStyles.actionBtnContainer,
                marginBottom: 10,
                width: '100%',
                position: 'absolute',
                bottom: 0,
                alignSelf: 'center',
              }}
            >
              <View style={{marginBottom: 10}}>
                <Text>Move screen to place marker to point towards your delivery location</Text>
              </View>
              <Button
                fullWidth={true}
                label="Confirm"
                disabled={false}
                onPress={props.onNext}
                loading={props.loading}
              />
            </View>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  mapStyle: {
    borderRadius: 20,
    overflow: 'hidden',
  },
});

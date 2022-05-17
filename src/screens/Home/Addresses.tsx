import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';

import {Ionicons} from '@expo/vector-icons';
import {useMutation} from '@apollo/client';
import * as Location from 'expo-location';
import {useDispatch, useSelector} from 'react-redux';

import {BoldText, Text} from '../../components/Common/Themed';
import {Button, CommonStyles, Header, Screen, Section} from '../../components/Common/Elements';

import {useServices} from '../../services';
import {DELETE_ADDRESS, UPDATE_ADDRESSES} from '../../graphql/Common/user';
import {setUser} from '../../redux/Common/actions';
import AddressPicker from '../../components/Common/AddressPicker';
import {SIZES} from '../../utils/constants';
import useColorScheme from '../../hooks/useColorScheme';
import {Colors} from 'react-native-ui-lib';

export default function Addresses() {
  const {t, nav} = useServices();
  const dispatch: any = useDispatch();
  const colorScheme = useColorScheme();

  // location
  const [userLocation, setUserLocation] = useState<object | null>(null);
  const [actLocation, setActLocation] = useState<any>(null);

  // manners, bleh
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

  const [delivery, setDelivery] = useState<any>({
    name: '',
    line1: '',
    line2: '',
    pincode: '',
  });

  const [newAddress, setNewAddress] = useState<boolean>(false);

  const {user} = useSelector((state: any) => state.userReducer);

  const [updateAddresses, {loading: creatingAddress}] = useMutation(UPDATE_ADDRESSES, {
    variables: {
      updateAddressInput: {...delivery, coordinates: userLocation},
    },
    onCompleted() {
      const deliveryAddresses = [...user.deliveryAddresses];
      deliveryAddresses.push({
        ...delivery,
        coordinates: userLocation,
      });
      dispatch(setUser({...user, deliveryAddresses: deliveryAddresses}));
      setDelivery({
        name: '',
        line1: '',
        line2: '',
        pincode: '',
      });
      setNewAddress(false);
    },
    onError(err) {
      console.log(err);
    },
  });

  const [deleteAddress, {loading: deletingAddress}] = useMutation(DELETE_ADDRESS, {
    variables: {
      coordinate: actLocation,
    },
    onCompleted(data) {
      if (data.deleteAddress) {
        const deliveryAddresses = [...user.deliveryAddresses];
        const i = deliveryAddresses.findIndex(e => e.coordinates === actLocation);
        deliveryAddresses.splice(i, 1);

        dispatch(
          setUser({
            ...user,
            deliveryAddresses: deliveryAddresses,
          }),
        );
      }
    },
    onError(err) {
      console.log(err);
    },
  });

  const askForLocationPermission = () => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      setLocationPermission(status ? 'granted' : 'denied');

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
        });
      }
    })();
  };

  useEffect(() => {
    askForLocationPermission();
  }, []);

  function switchNewAddress() {
    if (locationPermission === 'granted' && userLocation) {
      setNewAddress(!newAddress);
    }
  }

  if (locationPermission === null) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <BoldText style={CommonStyles.title}>
          Requesting location permissions to track location
        </BoldText>
      </View>
    );
  }

  if (newAddress) {
    return (
      <AddressPicker
        delivery={delivery}
        setDelivery={setDelivery}
        loading={creatingAddress}
        onBack={() => setNewAddress(false)}
        onNext={() => updateAddresses()}
      />
    );
  }

  return (
    <Screen>
      <Header
        title="Delivery Details"
        onBack={() => (newAddress ? switchNewAddress() : nav.pop())}
      />

      <Section
        title="Manage/Add new delivery address to place orders faster."
        body={
          <FlatList
            data={user.deliveryAddresses}
            contentContainerStyle={{marginTop: 10}}
            keyExtractor={e => Math.random().toFixed(2)}
            style={{width: '100%'}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.buttonbg,
                  width: '100%',
                  marginRight: 10,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                activeOpacity={0.5}
                delayPressIn={0}
                disabled={deletingAddress}
                // onPress={() => setDelivery(item)}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <BoldText style={{fontSize: SIZES.font.text}}>{item.name}</BoldText>
                  <Text numberOfLines={1} style={{maxWidth: '80%'}}>
                    {item.line1}, {item.line2}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setActLocation(item.coordinates);
                    deleteAddress();
                  }}
                  disabled={deletingAddress}
                >
                  {deletingAddress && actLocation === item.coordinates ? (
                    <ActivityIndicator color="#d00" />
                  ) : (
                    <Ionicons name="trash-outline" color="#d00" size={22} />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        }
      />

      <View style={CommonStyles.actionBtnContainer}>
        <Button
          label="New Address"
          disabled={newAddress}
          onPress={switchNewAddress}
          fullWidth={true}
        />
      </View>
    </Screen>
  );
}

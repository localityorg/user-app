import {BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';
import {useSelector} from 'react-redux';
import useColorScheme from '../../hooks/useColorScheme';
import {SIZES} from '../../utils/constants';
import {BoldText, Text, View} from '../Common/Themed';
import {CustomBackdrop, CustomBackground} from '../Retail/ModalStyle';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import {CommonStyles, Seperator} from '../Common/Elements';
import {darkMapStyle, lightMapStyle} from '../../constants/MapStyle';
import {TouchableOpacity} from 'react-native';
import {Colors} from 'react-native-ui-lib';

interface DestinationBtnProps {
  originPlaceholder: string;
  destinationPlaceholder: string;
}

export function DestinationBtn(props: DestinationBtnProps) {
  const {origin, destination} = useSelector((state: any) => state.tripReducer);

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [SIZES.screen.height / 2 + 40, '70%'], []);
  const colorScheme = useColorScheme();

  const [location, setLocation] = useState<any | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

  const [search, setSearch] = useState('');

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

  return (
    <>
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        style={{borderRadius: 20}}
        backgroundComponent={CustomBackground}
        backdropComponent={CustomBackdrop}
        onDismiss={() => setSearch('')}
      >
        <View
          style={{
            height: SIZES.screen.height / 2 - 40,
            width: SIZES.screen.width,
            marginBottom: 10,
            backgroundColor: 'transparent',
          }}
        >
          {location === null ? (
            <View style={CommonStyles.loadingContainer}>
              <BoldText>Loading Map...</BoldText>
            </View>
          ) : (
            <MapView
              initialRegion={{
                latitude: parseFloat(location?.latitude),
                longitude: parseFloat(location?.longitude),
                latitudeDelta: 0.0011,
                longitudeDelta: 0.0018,
              }}
              provider={PROVIDER_DEFAULT}
              customMapStyle={colorScheme === 'light' ? lightMapStyle : darkMapStyle}
              showsMyLocationButton={true}
              style={{flex: 1}}
            />
          )}
        </View>

        <BottomSheetTextInput
          value={search}
          onChangeText={(text: string) => setSearch(text)}
          style={{
            alignSelf: 'center',
            width: '90%',
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.buttonbg,
            color: Colors.text,
            backgroundColor: Colors.$backgroundDisabled,
            fontSize: SIZES.font.text,
          }}
          placeholderTextColor={Colors.buttonbg}
          placeholder="Search location"
        />
      </BottomSheetModal>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          height: 90,
          backgroundColor: Colors.$backgroundDisabled,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            width: 70,
            backgroundColor: 'transparent',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableOpacity onPress={() => askForLocationPermission()} style={{flex: 0}}>
            <Ionicons
              name={location ? 'location' : 'location-outline'}
              color={location ? Colors.buttonbg : Colors.tint}
              size={SIZES.icon.normal}
            />
          </TouchableOpacity>
          <View
            style={{
              height: SIZES.icon.normal * 2 - 20,
              width: 1,
              backgroundColor: Colors.buttonbg,
            }}
          />
          <Ionicons
            name="location-outline"
            color={destination ? Colors.buttonbg : Colors.tint}
            size={SIZES.icon.normal}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity style={{flex: 1}} onPress={() => sheetRef.current?.present()}>
            {origin ? (
              <BoldText>{origin.description}</BoldText>
            ) : (
              <Text style={{color: Colors.text}}>Where are you?</Text>
            )}
          </TouchableOpacity>
          <Seperator />
          <TouchableOpacity style={{flex: 1}}>
            {destination ? (
              <BoldText>{destination.description}</BoldText>
            ) : (
              <Text style={{color: Colors.$backgroundDisabled}}>Your Destination</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

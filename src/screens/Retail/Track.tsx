import React, {useEffect, useMemo, useState} from 'react';
import * as Location from 'expo-location';

import {useServices} from '../../services';
import {CommonStyles, Header, Screen} from '../../components/Common/Elements';

import BottomSheet from '@gorhom/bottom-sheet';
import {CustomBackground} from '../../components/Retail/ModalStyle';
import {BoldText, View} from '../../components/Common/Themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ModalProps} from '../../services/navigation/types';
import MapView, {PROVIDER_DEFAULT} from 'react-native-maps';
import {Ionicons} from '@expo/vector-icons';

import {darkMapStyle, lightMapStyle} from '../../constants/MapStyle';
import useColorScheme from '../../hooks/useColorScheme';
import {useSelector} from 'react-redux';
import {SIZES} from '../../utils/constants';
import {Alert, StatusBar} from 'react-native';
import TrackContent from '../../components/Retail/TrackContent';
import {useQuery} from '@apollo/client';

type Props = NativeStackScreenProps<ModalProps, 'RetailTrack'>;

export default function Track({route}: Props) {
  const {id, back, data}: any = route.params;
  const colorScheme = useColorScheme();
  const [points, setPoints] = useState([]);

  const {location: userLocation} = useSelector((state: any) => state.locationReducer);
  const {nav, t} = useServices();
  const snapPoints = useMemo(() => [SIZES.screen.height / 2, '90%'], []);

  // location
  const [location, setLocation] = useState<any | null>(null);
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

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

  // const {loading, subscribeToMore, refetch} = useQuery(GET_ORDER_LOCATION, {
  //   onCompleted(data){
  //     setPoints(data.getOrderLocation)
  //   },
  //   onError(err){
  //     Alert.alert('Error Occured', 'While fetching delivery updates, some error occured.', [{text: 'Go Back', onPress:()=>nav.pop()}, {text: 'Try Again', onPress:()=>refetch()}])
  //     console.log(err);
  //   }
  // })

  useEffect(() => {
    askForLocationPermission();
  }, []);

  return (
    <Screen>
      <View
        style={{
          ...CommonStyles.header,
          width: '95%',
          alignSelf: 'center',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
        }}
      >
        <Header
          title={t.do('screens.retail.screens.track.title')}
          onBack={() => nav.pop()}
          focused={true}
        />
      </View>
      <View
        style={{
          height: SIZES.screen.height / 2 - 40,
          width: SIZES.screen.width,
          overflow: 'hidden',
          position: 'absolute',
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
            style={{flex: 1}}
          />
        )}
      </View>
      <BottomSheet
        snapPoints={snapPoints}
        index={0}
        backgroundComponent={CustomBackground}
        style={{width: '100%', paddingTop: 0}}
      >
        <TrackContent data={data} />
      </BottomSheet>
    </Screen>
  );
}

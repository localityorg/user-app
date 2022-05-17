import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import useColorScheme from '../../hooks/useColorScheme';
import * as Location from 'expo-location';
import {darkMapStyle, lightMapStyle} from '../../constants/MapStyle';
import {BoldText, View} from './Themed';
import {CommonStyles} from './Elements';
import {useDispatch, useSelector} from 'react-redux';
import {setUserLocation} from '../../redux/Common/actions';

interface MapProps {
  location?: any;
  track?: boolean;
}

export function Map(props: MapProps) {
  const colorScheme = useColorScheme();
  const dispatch: any = useDispatch();

  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<any | null>(null);
  const [permission, setPermission] = useState<string | null>(null);

  const {origin, destination} = useSelector((state: any) => state.tripReducer);

  const askForLocationPermission = () => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      setPermission(status ? 'granted' : 'denied');

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        dispatch(
          setUserLocation({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          }),
        );
        setLocation({
          latitude: location.coords.latitude.toString(),
          longitude: location.coords.longitude.toString(),
        });
      }
    })();
  };

  useEffect(() => {
    if (!props.location || location === null) {
      askForLocationPermission();
    } else {
      setLocation(props.location);
    }
  }, [props.location]);

  useEffect(() => {
    if (!origin && !destination) return;
    else {
      mapRef.current?.fitToSuppliedMarkers(['origin', 'destination', 'rider'], {
        edgePadding: {top: 10, left: 10, right: 10, bottom: 10},
      });
    }
  }, [origin, destination]);

  if (permission !== 'granted') {
    return (
      <View style={CommonStyles.loadingContainer}>
        <BoldText>Permission not granted. Enable location permission to view map.</BoldText>
      </View>
    );
  }

  if (location === null) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <BoldText>Loading map...</BoldText>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      initialRegion={{
        latitude: parseFloat(location?.latitude),
        longitude: parseFloat(location?.longitude),
        latitudeDelta: 0.0011,
        longitudeDelta: 0.0018,
      }}
      provider={PROVIDER_DEFAULT}
      customMapStyle={colorScheme === 'light' ? lightMapStyle : darkMapStyle}
      showsMyLocationButton={true}
      showsUserLocation={true}
      style={{flex: 1}}
    >
      {props.track && (
        <>
          <Marker
            identifier="origin"
            coordinate={{
              latitude: parseFloat(origin.location.latitude),
              longitude: parseFloat(origin.location.longitude),
            }}
          />
          <Marker
            identifier="destination"
            coordinate={{
              latitude: parseFloat(destination.location.latitude),
              longitude: parseFloat(destination.location.longitude),
            }}
          />
        </>
      )}
    </MapView>
  );
}

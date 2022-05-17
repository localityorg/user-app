import React, {useCallback, useEffect, useMemo, useRef, useState, useContext} from 'react';
import {ActivityIndicator, Alert, BackHandler} from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import {useServices} from '../../services';
import {Button, CommonStyles, Screen} from '../../components/Common/Elements';
import {SIZES} from '../../utils/constants';
import {BoldText, Text, View} from '../../components/Common/Themed';
import Logo from '../../components/Common/Logo';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {setUser, setUserLocation} from '../../redux/Common/actions';
import {useDispatch, useSelector} from 'react-redux';
import {AuthContext} from '../../redux/Common/reducers/auth';

import {LOGIN_USER} from '../../graphql/Common/user';
import {useMutation} from '@apollo/client';

import * as Location from 'expo-location';
import {useNavigation} from '@react-navigation/native';
import Modal from '../../components/Common/Modal';
import DisplayImg from '../../components/Common/DisplayImg';
import HomeIcon from '../../components/Home/HomeIcon';
import {Colors} from 'react-native-ui-lib';
import {networkUrls} from '../../utils/constants';

export default function Home() {
  const [locationPermission, setLocationPermission] = useState<string | null>(null);

  const urls = networkUrls();
  const {nav, t, api} = useServices();
  const colorScheme = useColorScheme();
  const dispatch: any = useDispatch();
  const context: any = useContext(AuthContext);
  const navigation: any = useNavigation();

  // variables
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const start = useCallback(async () => {
    try {
      await api.counter.get();
    } catch (e) {
      Alert.alert('Error', 'Error starting internal API');
    }
  }, [api.counter]);

  useEffect(() => {
    start();
  }, []);

  const {user} = useSelector((state: any) => state.userReducer);
  const {location} = useSelector((state: any) => state.locationReducer);

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: {contact: context.user?.contact || null},
    onError(err) {
      context.logout();
      nav.push('Login');
    },
    onCompleted(data) {
      dispatch(setUser(data.login));
      context.login({
        id: data.login.id,
        vendor: data.login.vendor,
        token: data.login.token,
        refreshToken: data.login.refreshToken,
      });
    },
  });

  const askForLocationPermission = () => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      setLocationPermission(status ? 'granted' : 'denied');

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        dispatch(
          setUserLocation({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          }),
        );
      }
    })();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (user) {
        BackHandler.exitApp();
      } else {
        nav.push('Login');
      }
    });
    return unsubscribe;
  }, [navigation, user]);

  useEffect(() => {
    if (location === null) {
      askForLocationPermission();
    }
  }, [location]);

  useEffect(() => {
    if (!user?.deliveryAddresses) {
      loginUser();
    }
  }, [user]);

  if (user?.deliveryAddresses) {
    return (
      <>
        <Screen>
          <View style={CommonStyles.header}>
            <Logo size={SIZES.font.header} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <DisplayImg name={user?.name} off={false} size={SIZES.icon.header - 8} />
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
            <HomeIcon
              name="Ride"
              icon={`${urls.ICON_URI}home/auto-rickshaw.png`}
              onNav={() => nav.push('Ride')}
            />
            <HomeIcon
              name="Retail"
              icon={`${urls.ICON_URI}home/grocery.png`}
              onNav={() => nav.push('Retail')}
            />

            <HomeIcon
              name="Grid"
              icon={`${urls.ICON_URI}home/grid.png`}
              onNav={() => sheetRef.current?.present()}
            />
          </View>
        </Screen>
        <Modal content={<Text>Coming Soon 🎉</Text>} snapPoints={snapPoints} sheetRef={sheetRef} />
      </>
    );
  }

  return (
    <>
      <Screen>
        <View style={CommonStyles.header}>
          <Logo size={SIZES.font.header} />
        </View>
        <View style={CommonStyles.loadingContainer}>
          <ActivityIndicator color={Colors.tint} size="large" />
          <BoldText style={{fontSize: SIZES.font.text, marginTop: 15}}>User not logged in</BoldText>
        </View>
      </Screen>
    </>
  );
}

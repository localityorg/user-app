import React, {useCallback, useContext, useEffect} from 'react';
import {Alert} from 'react-native';

import {LoadingContainer} from '../../components/Common/Elements';
import {AuthContext} from '../../redux/Common/reducers/auth';

import {useServices} from '../../services';

export default function Splash() {
  const {nav, api} = useServices();
  const {user} = useContext(AuthContext);

  const checkUser = () => {
    if (user) {
      nav.push('Main');
    } else {
      nav.push('Onboarding');
    }
  };

  const start = useCallback(async () => {
    try {
      await api.counter.get();
      checkUser();
    } catch (e) {
      Alert.alert('Error', 'There was a problem fetching data :(');
    }
  }, [api.counter]);

  useEffect(() => {
    start();
  }, [user]);

  return <LoadingContainer />;
}

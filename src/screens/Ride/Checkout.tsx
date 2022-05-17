import React, {useCallback, useEffect} from 'react';
import {ScrollView, Alert, ActivityIndicator} from 'react-native';

import {useServices} from '../../services';

import {View} from '../../components/Common/Themed';
import {Header, Screen} from '../../components/Common/Elements';

export default function Checkout() {
  const {nav, t, api} = useServices();

  return (
    <Screen>
      <Header onBack={() => nav.pop()} title={t.do('screens.checkout.title')} />
    </Screen>
  );
}

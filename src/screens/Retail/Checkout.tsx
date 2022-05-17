import React, {useCallback, useEffect} from 'react';
import {ScrollView, Alert, ActivityIndicator} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {If} from '@kanzitelli/if-component';

import {useServices} from '../../services';
import {Header, Screen} from '../../components/Common/Elements';

export default function Checkout() {
  const {nav, t} = useServices();

  return (
    <Screen>
      <Header title={t.do('screens.checkout.title')} onBack={() => nav.pop()} />
    </Screen>
  );
}

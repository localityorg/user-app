import React, {useCallback, useEffect} from 'react';
import {ScrollView, Alert, ActivityIndicator} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {observer} from 'mobx-react';

import {useServices} from '../../services';

import {Section} from '../../components/section';
import {Header, Screen} from '../../components/Common/Elements';

export default function Track() {
  const {nav, t} = useServices();
  return (
    <Screen>
      <Header onBack={() => nav.pop()} title={t.do('screens.checkout.title')} />
    </Screen>
  );
}

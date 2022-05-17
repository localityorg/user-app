import React, {useCallback, useEffect} from 'react';
import {ScrollView, Alert, ActivityIndicator} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {If} from '@kanzitelli/if-component';

import {useServices} from '../../services';
import {Header, Screen} from '../../components/Common/Elements';

export default function Trips() {
  const {nav, t} = useServices();

  return (
    <Screen>
      <Header title={t.do('screens.trips.title')} />
    </Screen>
  );
}

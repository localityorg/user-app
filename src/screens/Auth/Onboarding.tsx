import React, {useEffect} from 'react';
import {observer} from 'mobx-react';

import {useServices} from '../../services';
import {Button, CommonStyles, Header, Screen} from '../../components/Common/Elements';
import {View} from '../../components/Common/Themed';
import {useNavigation} from '@react-navigation/native';
import {BackHandler} from 'react-native';

export const Onboarding: React.FC = observer(({}) => {
  const {nav, t} = useServices();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      BackHandler.exitApp();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Screen>
      <Header title={t.do('screens.onboarding.title')} key={9422239443} />
      <View style={{flex: 1}}></View>
      <View style={CommonStyles.actionBtnContainer}>
        <Button label="Login" onPress={() => nav.push('Login')} fullWidth={true} />
        <View style={{height: 10}} />
        <Button
          label="Register"
          onPress={() => nav.push('Register')}
          fullWidth={true}
          transparent={true}
        />
      </View>
    </Screen>
  );
});

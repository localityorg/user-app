import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, Alert, ActivityIndicator, Keyboard} from 'react-native';

import {Button, CommonStyles, Header, InputText, Screen} from '../../components/Common/Elements';
import {BoldText, Text, View} from '../../components/Common/Themed';
import ContactInput from '../../components/Auth/ContactInput';

import {useServices} from '../../services';
import {useDispatch, useSelector} from 'react-redux';
import {useLazyQuery, useMutation} from '@apollo/client';
import {REGISTER_USER} from '../../graphql/Common/user';
import {TWOFACTOR_AUTH} from '../../graphql/Common/auth';
import TFA from '../../components/Auth/TFA';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {SIZES} from '../../utils/constants';
import useColorScheme from '../../hooks/useColorScheme';
import {AuthContext} from '../../redux/Common/reducers/auth';
import {Colors} from 'react-native-ui-lib';

export default function Register() {
  const {nav, t} = useServices();
  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();
  const context = useContext(AuthContext);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const {location} = useSelector((state: any) => state.locationReducer);

  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState({
    error: false,
    text: 'Verifying phone number.',
  });

  const [user, setUser] = useState({
    name: '',
    business: false,
    contact: {
      ISD: '+91',
      number: '',
    },
    categories: [],
  });

  const [addUser, {data, loading}] = useMutation(REGISTER_USER, {
    variables: {...user, coordinates: location},
    onCompleted(data) {
      context.login({
        id: data.register.id,
        name: data.register.name,
        token: data.register.token,
        refreshToken: data.register.refreshToken,
      });
      dispatch(setUser(data.register));
      nav.push('Main');
    },
    onError(error) {
      Alert.alert('Seems to be a problem!', `${error}`);
    },
  });

  const [twoFactorAuth, {data: twoFactorData, loading: tfaLoading}] = useLazyQuery(TWOFACTOR_AUTH, {
    variables: {
      contact: user.contact,
      newAcc: true,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.twoFactorAuth.error) {
        setMessage({error: true, text: 'Account with this contact does not exist.'});
      } else {
        bottomSheetModalRef.current?.present();
      }
    },
    onError(err) {
      Alert.alert(`Seems like a problem`, `${err}`, [
        {
          text: 'Try Again',
          onPress: () => setUser({...user, contact: {ISD: '', number: ''}}),
          style: 'cancel',
        },
      ]);
    },
  });

  function cancelRegisteration() {
    return Alert.alert(
      t.do('screens.register.alerts.cancel.title'),
      t.do('screens.register.alerts.cancel.message'),
      [
        {text: t.do('screens.register.alerts.cancel.no'), style: 'cancel'},
        {
          text: t.do('screens.register.alerts.cancel.yes'),
          style: 'destructive',
          onPress: () => {
            setUser({
              name: '',
              business: false,
              contact: {
                ISD: '+91',
                number: '',
              },
              categories: [],
            });
            setConfirmed(false);
          },
        },
      ],
    );
  }

  function onChangeNumber(text: string) {
    setMessage({...message, error: false});
    setUser({...user, contact: {...user.contact, number: text}});
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (!confirmed) {
        nav.push('Onboarding');
      } else {
        cancelRegisteration();
      }
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tint} style={{marginBottom: 5}} />
        <BoldText style={{fontSize: SIZES.font.text}}>
          {t.do('screens.register.setup.loading')}
          <BoldText style={{color: Colors.tint}}>locality</BoldText>
        </BoldText>
      </View>
    );
  }

  if (confirmed) {
    <Screen>
      <Header
        title={t.do('screens.register.setup.title')}
        onBack={() => cancelRegisteration()}
        key={9422239443}
      />
      <InputText
        value={user.name}
        onChange={(text: string) => setUser({...user, name: text})}
        placeholder={t.do('screens.register.setup.name.placeholder')}
        title={t.do('screens.register.setup.name.title')}
        autoFocus={true}
      />
      <View style={CommonStyles.actionBtnContainer}>
        <Button
          label={t.do('screens.register.setup.confirm')}
          fullWidth={true}
          onPress={() => addUser()}
        />
      </View>
    </Screen>;
  }

  return (
    <>
      <TFA
        contact={user.contact}
        newAcc={true}
        bottomSheetModalRef={bottomSheetModalRef}
        message={message}
        text={t.do('screens.register.tfa')}
        date={twoFactorData?.twoFactorAuth.date}
        onCompleted={() => setConfirmed(true)}
        ukey={3912493949}
        onDismiss={() => {
          setUser({...user, contact: {ISD: '+91', number: ''}});
          nav.push('Onboarding');
        }}
      />
      <Screen>
        <Header title={t.do('screens.register.title')} onBack={() => nav.pop()} key={9422239443} />
        <ContactInput
          setContact={(text: string) => onChangeNumber(text)}
          contact={user.contact}
          loading={tfaLoading}
          onNext={() =>
            twoFactorAuth({
              variables: {
                contact: user.contact,
                newAcc: true,
              },
            })
          }
          lock={confirmed}
          autoFocus={true}
          key={9342342341}
        />

        <View style={CommonStyles.actionBtnContainer}>
          {message.error && (
            <View style={CommonStyles.errorContainer}>
              <Text style={CommonStyles.errorText}>{message.text}</Text>
            </View>
          )}
        </View>
      </Screen>
    </>
  );
}

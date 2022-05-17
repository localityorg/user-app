import React, {useContext, useEffect, useRef, useState} from 'react';
import {Alert, ActivityIndicator, StyleSheet, BackHandler, Keyboard} from 'react-native';
import {If} from '@kanzitelli/if-component';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useDispatch} from 'react-redux';
import {useLazyQuery, useMutation} from '@apollo/client';

import {useServices} from '../../services';

import useColorScheme from '../../hooks/useColorScheme';
import {setUser} from '../../redux/Common/actions';

import TFA from '../../components/Auth/TFA';
import {Text, View} from '../../components/Common/Themed';
import ContactInput from '../../components/Auth/ContactInput';
import {CommonStyles, Header, Screen} from '../../components/Common/Elements';
import {useNavigation} from '@react-navigation/native';

import {LOGIN_USER} from '../../graphql/Common/user';
import {TWOFACTOR_AUTH} from '../../graphql/Common/auth';
import {AuthContext} from '../../redux/Common/reducers/auth';
import {Colors} from 'react-native-ui-lib';

export default function Login() {
  const {nav, t} = useServices();
  const colorScheme = useColorScheme();
  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();
  const context = useContext(AuthContext);

  const [message, setMessage] = useState({
    error: false,
    text: '',
  });

  const [contact, setContact] = useState({
    ISD: '+91',
    number: '',
  });

  const tfaSheet = useRef<BottomSheetModal>(null);

  const [loginUser, {loading}] = useMutation(LOGIN_USER, {
    variables: {contact: contact},
    onError(err) {
      Alert.alert('Error Occured!', 'Wrong Credentials, try again.');
      process.env.NODE_ENV && console.log(err);
    },
    onCompleted(data) {
      if (data.login) {
        dispatch(setUser(data.login));
        context.login({
          id: data.login.id,
          name: data.login.name,
          token: data.login.token,
          refreshToken: data.login.refreshToken,
        });
        setMessage({
          error: false,
          text: 'Logged in Successfully.',
        });
        setContact({
          ISD: '+91',
          number: '',
        });
      }
    },
  });

  const [twoFactorAuth, {data: twoFactorData, loading: tfaLoading}] = useLazyQuery(TWOFACTOR_AUTH, {
    variables: {
      contact,
      newAcc: false,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.twoFactorAuth.error) {
        setMessage({
          error: true,
          text: data.twoFactorAuth.message || 'Error Occured while logging in!',
        });
      } else {
        tfaSheet?.current?.present();
      }
    },
    onError(err) {
      console.log(err);
    },
  });

  const onSubmit = () => {
    setMessage({
      error: false,
      text: 'Logging in user.',
    });
    loginUser();
  };

  function handleContactAuth() {
    setMessage({
      error: false,
      text: 'Verifying phone number,',
    });
    twoFactorAuth({
      variables: {
        contact,
        newAcc: false,
      },
    });
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      nav.push('Onboarding');
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <ActivityIndicator color={Colors.tint} size={'large'} style={{marginBottom: 10}} />
        <Text>Logging you in...</Text>
      </View>
    );
  }

  return (
    <>
      <TFA
        contact={contact}
        newAcc={false}
        bottomSheetModalRef={tfaSheet}
        message={message}
        text={t.do('screens.login.tfa')}
        date={twoFactorData?.twoFactorAuth.date}
        onCompleted={() => onSubmit()}
        ukey={9909090909}
        onDismiss={() => console.log('delete req')}
      />
      <Screen>
        <Header
          title={t.do('screens.login.title')}
          onBack={() => nav.push('Onboarding')}
          key={9422239443}
        />
        <View>
          <Text style={styles.contentText}>{t.do('screens.login.text')}</Text>
          <ContactInput
            contact={contact}
            setContact={(text: string) => setContact({...contact, number: text})}
            onNext={() => handleContactAuth()}
            loading={tfaLoading}
            key={6543083481}
            autoFocus={true}
            lock={false}
          />
        </View>
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

const styles = StyleSheet.create({
  contactContainer: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginVertical: '5%',
  },
  contactInput: {
    fontSize: 18,
    padding: 10,
    flex: 1,
  },
  contactSubmitBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 20,
    padding: 10,
    marginBottom: 5,
    color: '#111111',
    width: '95%',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    paddingBottom: 10,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'column',
  },
  linkBtnText: {
    color: '#777',
    fontSize: 16,
  },
  linkBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 18,
    alignSelf: 'flex-start',
    color: '#888',
    width: '90%',
  },
});

const otpInputStyles = StyleSheet.create({
  underlineStyleBase: {
    width: 30,
    height: 45,
    color: '#111',
    fontSize: 20,
    borderWidth: 0,
    borderBottomWidth: 2,
  },
  underlineStyleHighLighted: {
    borderColor: '#1ea472',
  },
});

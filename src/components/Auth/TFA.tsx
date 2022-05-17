import React, {useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';

import {useLazyQuery} from '@apollo/client';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import OTPInputView from '@twotalltotems/react-native-otp-input';

import {BoldText, Text, View} from '../Common/Themed';
import {CommonStyles, LoadingContainer} from '../Common/Elements';

import {CHECK_AUTH} from '../../graphql/Common/auth';

import ResendOTP from './ResendOTP';
import {CustomBackdrop, CustomBackground} from '../Retail/ModalStyle';
import {SIZES} from '../../utils/constants';

import {Colors} from 'react-native-ui-lib';

interface TFAProps {
  onCompleted: any;
  onDismiss: any;
  bottomSheetModalRef: any;
  message: any;
  text?: string;
  date: string;
  ukey: number;
  newAcc: boolean;
  contact: any;
}

export default function TFA(props: TFAProps) {
  const [message, setMessage] = useState<any>(null);
  const [code, setCode] = useState<string>('');

  const snapPoints = useMemo(() => [SIZES.screen.width], []);

  const [checkAuth, {loading: authLoading}] = useLazyQuery(CHECK_AUTH, {
    variables: {
      contact: props.contact,
      secureCode: code,
    },
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      if (data.checkAuth.error) {
        setMessage('6 digit code does not match. Try Again or Resend code');
      } else {
        props.bottomSheetModalRef.current.close();
        props.onCompleted();
      }
    },
    onError(err) {
      Alert.alert('Oops!', `${err}. Check 6 digit code or Get a new code.`);
    },
  });

  useEffect(() => {
    setMessage(props.message);
  }, [props.message]);

  return (
    <BottomSheetModal
      ref={props.bottomSheetModalRef}
      index={0}
      key={props.ukey}
      snapPoints={snapPoints}
      style={{borderRadius: 20}}
      backdropComponent={CustomBackdrop}
      backgroundComponent={CustomBackground}
      onDismiss={props.onDismiss}
    >
      {authLoading ? (
        <LoadingContainer />
      ) : (
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            padding: 10,
            backgroundColor: 'transparent',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: 5,
              marginBottom: 5,
              backgroundColor: 'transparent',
            }}
          >
            <BoldText style={{fontSize: 18}}>Contact Verification</BoldText>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: '#555',
              textAlign: 'left',
            }}
          >
            {props.text ||
              'For verification, enter 6 digit code sent to your registered number. Close to dismiss action.'}
          </Text>
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              marginTop: 10,
              backgroundColor: 'transparent',
            }}
          >
            <OTPInputView
              style={{
                width: '100%',
                height: 100,
                zIndex: 99,
              }}
              placeholderTextColor={Colors.tabIconDefault}
              code={code}
              key={props.ukey + 1}
              onCodeChanged={text => setCode(text)}
              pinCount={6}
              keyboardType="phone-pad"
              selectionColor={Colors.tint}
              autoFocusOnLoad={true}
              keyboardAppearance="default"
              codeInputFieldStyle={otpInputStyles.underlineStyleBase}
              codeInputHighlightStyle={otpInputStyles.underlineStyleHighLighted}
              onCodeFilled={code =>
                checkAuth({
                  variables: {
                    contact: props?.contact,
                    secureCode: code,
                  },
                })
              }
            />
            <ResendOTP
              date={props.date}
              newAcc={props.newAcc}
              contact={props.contact}
              setCode={() => setCode('')}
            />
          </View>
        </View>
      )}
      {message && message.error && (
        <View style={CommonStyles.errorContainer}>
          <Text style={CommonStyles.errorText}>{message.text}</Text>
        </View>
      )}
    </BottomSheetModal>
  );
}

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

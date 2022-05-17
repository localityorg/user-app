import React, {useCallback, useEffect, useMemo} from 'react';
import {ScrollView, Alert, ActivityIndicator} from 'react-native';

import {useServices} from '../../services';

import {BoldText, View} from '../../components/Common/Themed';
import {Button, CommonStyles, Header, Screen} from '../../components/Common/Elements';

import BottomSheet from '@gorhom/bottom-sheet';
import {Map} from '../../components/Common/Map';
import {CustomBackdrop, CustomBackground} from '../../components/Retail/ModalStyle';
import {SIZES} from '../../utils/constants';
import {useDispatch} from 'react-redux';
import {setDestination} from '../../redux/Ride/actions';

export default function Book() {
  const {nav, t} = useServices();
  const dispatch: any = useDispatch();

  const snapPoints = useMemo(() => [SIZES.screen.height / 2, '80%'], []);

  return (
    <Screen>
      <View
        style={{
          ...CommonStyles.header,
          width: '95%',
          alignSelf: 'center',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
        }}
      >
        <Header
          title={t.do('screens.ride.screens.book.title')}
          onBack={() => {
            dispatch(setDestination(null));
            nav.pop();
          }}
          focused={true}
        />
      </View>
      <Map track={true} />
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        backgroundComponent={CustomBackground}
        style={{width: '100%', padding: '5%', paddingTop: 0}}
      >
        <View style={{flex: 1, marginTop: '1%', backgroundColor: 'transparent'}}>
          <BoldText>Book Trip</BoldText>
        </View>
        <Button label="Book Now" onPress={() => nav.push('RideTrack')} fullWidth={true} />
      </BottomSheet>
    </Screen>
  );
}

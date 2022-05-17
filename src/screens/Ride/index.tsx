import React, {useState} from 'react';

import {useServices} from '../../services';
import {CategoryBtn, Header, Screen} from '../../components/Common/Elements';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {SIZES} from '../../utils/constants';

import {GOOGLE_MAPS_APIKEY} from '@env';
import {useDispatch} from 'react-redux';
import {setOrigin} from '../../redux/Ride/actions';

import {DestinationBtn} from '../../components/Ride/DestinationBtn';

import {Map} from '../../components/Common/Map';
import Picker from '../../components/Ride/Picker';
import {Colors} from 'react-native-ui-lib';
import {View} from '../../components/Common/Themed';

function GooglePlacesInput() {
  const dispatch: any = useDispatch();

  return (
    <GooglePlacesAutocomplete
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={400}
      placeholder="Where are you?"
      query={{
        key: GOOGLE_MAPS_APIKEY,
        language: 'en', // language of the results
      }}
      onPress={(data, details) => {
        dispatch(
          setOrigin({
            location: details?.geometry.location,
            descripton: data.description,
          }),
        );
      }}
      onFail={err => console.log(err)}
      styles={{
        container: {
          flex: 0,
          backgroundColor: Colors.$backgroundDisabled,
        },
        textInput: {
          fontSize: SIZES.font.text,
          backgroundColor: Colors.background,
          color: Colors.text,
        },
      }}
      fetchDetails={true}
      enablePoweredByContainer={false}
      minLength={2}
    />
  );
}

export default function Main() {
  const {nav, t} = useServices();
  const [search, setSearch] = useState('');

  return (
    <Screen>
      <Header title={t.do('screens.ride.title')} onBack={() => nav.pop()} />
      <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
        {['Book Now', 'Schedule'].map(e => (
          <CategoryBtn
            key={e}
            active={e === 'Book Now'}
            text={e}
            disabled={e === 'Schedule'}
            onPress={() => {}}
          />
        ))}
      </View>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          height: '83%',
          width: SIZES.screen.width,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <Map />
      </View>
      <Picker />
    </Screen>
  );
}

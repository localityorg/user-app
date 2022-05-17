import React, {useMemo, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, TouchableOpacity} from 'react-native';

import {BoldText, Text, TextInput, View} from '../Common/Themed';
import {CategoryBtn, CommonStyles, Seperator} from '../Common/Elements';

import {Ionicons, AntDesign} from '@expo/vector-icons';
import {setDestination} from '../../redux/Ride/actions';

import {useDispatch, useSelector} from 'react-redux';
import {SIZES} from '../../utils/constants';
import {useServices} from '../../services';
import {Colors} from 'react-native-ui-lib';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Modal from '../Common/Modal';

interface PlacesProps {
  data: any;
  loading?: boolean;
  count: number;
}

function PlacesRender(props: PlacesProps) {
  const dispatch: any = useDispatch();
  const {t, nav} = useServices();

  if (props.loading) {
    return (
      <View style={{...CommonStyles.loadingContainer, height: 100}}>
        <ActivityIndicator color={Colors.tint} size={'large'} />
      </View>
    );
  }

  if (props.data?.length === 0) {
    return (
      <View style={{...CommonStyles.loadingContainer, height: 100}}>
        <BoldText style={{fontSize: SIZES.font.text}}>
          {props.count > 0 ? 'Could not find places. Try Again' : 'Search places.'}
        </BoldText>
      </View>
    );
  }

  return (
    <FlatList
      data={props.data}
      initialNumToRender={3}
      // onEndReached={()=>refetch()}
      keyExtractor={(e: any) => e.id}
      ItemSeparatorComponent={() => <Seperator />}
      renderItem={(item: any) => (
        <TouchableOpacity
          style={{width: '100%', paddingVertical: 10, flexDirection: 'row'}}
          activeOpacity={SIZES.opacity.thumbnail}
          onPress={() => {
            dispatch(
              setDestination({
                location: item.location,
                description: item.description,
              }),
            );
            nav.push('RideBook');
          }}
        >
          {item.recent ? (
            <AntDesign name="reload1" color={Colors.tint} size={SIZES.icon.normal} />
          ) : (
            <Ionicons name="location" color={Colors.tint} size={SIZES.icon.normal} />
          )}
          <BoldText style={{fontSize: SIZES.font.text}}>{item.name}</BoldText>
        </TouchableOpacity>
      )}
    />
  );
}

interface PickerProps {}

export default function Picker(props: PickerProps) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const [focus, setFocus] = useState(false);

  const pickerRef = useRef<BottomSheetModal>(null);
  const pickerSnaps = useMemo(() => [focus ? '80%' : '50%'], []);

  {
    /*
    const [searchPlaces, {loading, fetchMore}] = useLazyQuery(GET_PLACES, {
        variables:{
            query: search,
        },
        onCompleted(data){
            setCount(count+1);
            setData(data.fetchPlaces);
        },
        onError(err){
            console.log(err);
        }
    })
    */
  }

  return (
    <>
      <Modal
        content={
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.$backgroundDisabled,
                padding: 10,
              }}
            >
              <TextInput
                value={search}
                style={{flex: 1, fontSize: SIZES.font.text}}
                placeholder="Where do you want to go?"
                onFocus={() => setFocus(true)}
                placeholderTextColor={Colors.$textNeutral}
                onChangeText={(text: string) => setSearch(text)}
              />
              <TouchableOpacity onPress={() => {}} disabled={search.length < 2}>
                <Ionicons
                  size={SIZES.icon.normal}
                  color={search.length > 2 ? Colors.tint : Colors.$textDisabled}
                  name={'search'}
                />
              </TouchableOpacity>
            </View>
            <PlacesRender count={count} data={data} loading={false} />
          </View>
        }
        sheetRef={pickerRef}
        snapPoints={pickerSnaps}
        onDismiss={() => setSearch('')}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          marginBottom: '5%',
          flexDirection: 'column',
          width: '100%',
          marginVertical: 15,
          backgroundColor: Colors.$backgroundDefault,
          alignSelf: 'center',
        }}
      >
        {/* Now / Schedule */}
        {/* <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 15}}>
        <CategoryBtn active={true} onPress={() => {}} text={'Now'} />
        <CategoryBtn active={true} onPress={() => {}} text={'Schedule'} disabled={true} />
      </View> */}
        {/* Search */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.$backgroundDisabled,
            padding: 10,
          }}
          onPress={() => pickerRef.current?.present()}
          activeOpacity={SIZES.opacity.thumbnail}
        >
          <View style={{flex: 0}}>
            <Ionicons name="search" color={Colors.$textDefault} size={SIZES.icon.normal} />
          </View>

          <Text style={{marginLeft: 10, flex: 1, fontSize: SIZES.font.text}}>
            Where do you want to go?
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

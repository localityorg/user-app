import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {StyleSheet, TouchableOpacity, Dimensions, RefreshControl, FlatList} from 'react-native';

import {useLazyQuery} from '@apollo/client';
import {AntDesign, Ionicons} from '@expo/vector-icons';

import {BoldText, View, Text} from '../../Common/Themed';
import {CommonStyles, LoadingContainer} from '../../Common/Elements';
import {GET_STORES} from '../../../graphql/Retail/store';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useSelector} from 'react-redux';
import {CustomBackground} from '../ModalStyle';
import useColorScheme from '../../../hooks/useColorScheme';
import {SIZES} from '../../../utils/constants';
import {Colors} from 'react-native-ui-lib';

const {width: totalWidth} = Dimensions.get('window');
const cursorWidth = (totalWidth * 0.9) / 2;

interface SwitchProps {
  onPress: any;
  storeId: string;
  address: any;
}

const storeChoice = [
  {
    text: 'Nearest Store',
    value: 0,
  },
  {
    text: 'Store of Choice',
    value: 1,
  },
];

function StatusIndicator(props: {available: boolean; amount: string}) {
  if (!props.available) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Ionicons name="information-circle-outline" color="#888" style={{marginRight: 8}} />

        <Text style={{color: '#888'}}>Store currently does not accept accounts.</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Text style={{color: Colors.tint}}>
        {parseFloat(props.amount) > 0 ? `Account credit pending: ₹ ${props.amount}/-` : 'Available'}
      </Text>
    </View>
  );
}

export default function StoreSwitch(props: SwitchProps) {
  const colorScheme = useColorScheme();

  const {stores} = useSelector((state: any) => state.storesReducer);

  const [switchState, setSwitchState] = useState<any>(stores || []);
  const [fetchedStores, setFetchedStores] = useState<any>([]);

  const snapPoints = useMemo(() => ['80%'], []);
  const StoreFetchModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback(() => {}, []);

  const [fetchStores, {loading, refetch, networkStatus}] = useLazyQuery(GET_STORES, {
    variables: {
      coordinates: props.address?.coordinates,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setFetchedStores(data.getAccountStores);
    },
    onError(err) {
      console.log('Error fetching stores');
    },
  });

  useEffect(() => {
    if (props.storeId.length === 0) {
      setSwitchState(storeChoice[0]);
    } else {
      setSwitchState(storeChoice[1]);
    }
  }, [props.storeId]);

  useEffect(() => {
    if (props.address) {
      fetchStores({
        variables: {
          coordinates: props.address.coordinates,
        },
      });
    }
  }, [props.address]);

  function handleModalClose() {}

  return (
    <>
      <BottomSheetModal
        ref={StoreFetchModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{
          borderRadius: 20,
        }}
        backgroundComponent={CustomBackground}
        key={1993049294}
        android_keyboardInputMode="adjustPan"
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
      >
        {loading || networkStatus === 4 ? (
          <LoadingContainer />
        ) : (
          <FlatList
            style={{
              width: '90%',
              flex: 1,
              paddingBottom: 20,
              flexDirection: 'column',
              alignSelf: 'center',
              marginBottom: '5%',
            }}
            refreshControl={<RefreshControl onRefresh={() => refetch()} refreshing={loading} />}
            data={fetchedStores}
            showsVerticalScrollIndicator={false}
            keyExtractor={(e: any) => e.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => props.onPress(item)} style={styles.storeTile}>
                <Text>
                  <BoldText style={{fontSize: 16}}>{item.name}</BoldText>
                  <Text style={{color: '#888'}}> {item.distance} m</Text>
                </Text>

                <StatusIndicator available={item.available} amount={item.amount} />
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <View style={CommonStyles.header}>
                <TouchableOpacity onPress={() => handleModalClose()}>
                  <AntDesign name="back" size={SIZES.icon.header} color={Colors.text} />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <BoldText
                    style={{
                      fontSize: 25,
                    }}
                  >
                    Stores near you
                  </BoldText>
                  <TouchableOpacity onPress={() => refetch()} style={{marginLeft: 15}}>
                    <AntDesign name="reload1" size={SIZES.icon.normal} color={Colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        )}
      </BottomSheetModal>
      {switchState && (
        <View style={styles.container}>
          {storeChoice.map((obj: any) => (
            <TouchableOpacity
              style={{
                width: cursorWidth * 0.95,
                height: 40,
                borderRadius: switchState.value === obj.value ? 10 : 0,
                backgroundColor: switchState.value === obj.value ? '#fff' : '#ddd',
                shadowColor: switchState.value === obj.value ? '#000' : 'transparent',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: switchState.value === obj.value ? 5 : 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              delayPressIn={0}
              key={obj.value.toString()}
              onPress={() => {
                setSwitchState(obj);
                obj.value === 0 ? props.onPress(null) : StoreFetchModalRef.current?.present();
              }}
              disabled={obj.value === switchState.value}
            >
              <BoldText
                style={{
                  color: switchState.value === obj.value ? '#111' : '#555',
                }}
              >
                {obj.text}
              </BoldText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#d2d2d2',
    backgroundColor: '#ddd',
  },
  storeTile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 16,
  },
});

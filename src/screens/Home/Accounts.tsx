import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Linking,
  Alert,
} from 'react-native';

import {useMutation, useLazyQuery} from '@apollo/client';
import {ImageLoader} from 'react-native-image-fallback';
import {AntDesign} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {CartSheetStyles, CommonStyles, Header, Screen} from '../../components/Common/Elements';
import DisplayImg from '../../components/Common/DisplayImg';
import {BoldText, Text} from '../../components/Common/Themed';
import DynamicStatusBar from '../../components/Common/StatusBar';

import useColorScheme from '../../hooks/useColorScheme';

import {networkUrls, SIZES} from '../../utils/constants';
import {FETCH_ORDER_PRODUCTS} from '../../graphql/Retail/product';
import {BOOL_RUNNINGACCOUNT_PRIVACY, FETCH_SETTLE_URL} from '../../graphql/Retail/account';
import {useServices} from '../../services';
import {Colors} from 'react-native-ui-lib';

function OrderDetails({item}: any) {
  const [products, setProducts] = useState<any>(null);
  const urls = networkUrls();

  const [fetchDetails, {loading}] = useLazyQuery(FETCH_ORDER_PRODUCTS, {
    variables: {
      orderId: item.orderId,
    },
    onCompleted(data) {
      setProducts(data.getOrder.products);
    },
    onError(err) {
      if (process.env.NODE_ENV) {
        console.log(err);
      }
    },
  });

  return (
    <View
      style={{
        padding: 10,
        width: '100%',
        marginBottom: 10,
        paddingBottom: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderWidth: products ? 0 : 1,
        borderRadius: products ? 10 : 5,
        borderColor: products ? Colors.buttonbg : Colors.$backgroundDisabled,
        backgroundColor: 'transparent',
      }}
    >
      <TouchableOpacity
        onPress={() => fetchDetails()}
        disabled={products !== null}
        style={{
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Text>loc{item.orderId.toString().slice(16)}</Text>
          <BoldText>₹ {item.amount}/-</BoldText>
        </View>
        <View>
          <Text
            style={{
              color: item.paid ? '#1ea472' : Colors.text,
              backgroundColor: item.paid ? 'transparent' : Colors.background,
              padding: item.paid ? 0 : 2,
              borderRadius: 2,
            }}
          >
            {item.paid ? 'paid' : 'unpaid'}
          </Text>
        </View>
      </TouchableOpacity>

      {products !== null && (
        <FlatList
          key={1004032123}
          data={products}
          style={{paddingBottom: 5, width: '100%'}}
          keyExtractor={e => e.id.toString()}
          renderItem={({item}: any) => (
            <View style={CartSheetStyles.inventoryProduct}>
              <View style={CartSheetStyles.rowContainer}>
                <ImageLoader
                  source={`${urls.IMG_URI}${item?.imageUrl}.jpg`}
                  fallback={[`${urls.ICON_URI}imagedefault.png`]}
                  style={{
                    height: 40,
                    width: 40,
                    marginRight: 10,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <BoldText
                    style={{
                      color: Colors.text,
                      width: '90%',
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </BoldText>
                  <Text style={{color: Colors.$textNeutral}}>
                    {item.quantity.count}
                    {item.quantity.type} x {item.itemQuantity}
                  </Text>
                </View>

                <BoldText
                  style={{
                    color: Colors.text,
                    textAlign: 'right',
                  }}
                >
                  ₹ {item.totalPrice}/-
                </BoldText>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function KhataItem({khata}: any) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [300], []);
  const handleSheetChanges = useCallback(() => {}, []);

  const [open, setOpen] = useState(false);
  const [priv, setPriv] = useState();

  const [transactionId, setTransactionId] = useState('');
  const [payments, setPayments] = useState<boolean>(false);
  const [closed, setClosed] = useState(khata.closed);

  const [boolPrivacy, {loading}] = useMutation(BOOL_RUNNINGACCOUNT_PRIVACY, {
    variables: {
      id: khata.store.id,
    },
    onError(err) {
      console.log(err);
    },
  });

  const [fetchUrl, {loading: fetching}] = useMutation(FETCH_SETTLE_URL, {
    variables: {
      id: khata.data.id,
    },
    onCompleted(data) {
      if (data.settleAccountUri.error) {
        Alert.alert('Error!', data.settleAccountUri.message, [{text: 'Okay', style: 'cancel'}], {
          cancelable: true,
        });
      } else {
        const FETCH_URL = data.settleAccountUri.url;
        Linking.canOpenURL(FETCH_URL)
          .then(() => {
            Linking.openURL(FETCH_URL).catch(err => console.log(`Error Occured: ${err}`));
          })
          .catch(err => console.log(`Error Occured: ${err}`));
      }
    },
  });

  return (
    <>
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          borderWidth: 1,
          borderRadius: 10,
          borderColor: open || payments ? '#111' : 'transparent',
        }}
      >
        <View style={CommonStyles.section}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <View style={styles.row}>
                <BoldText style={{fontSize: 18, color: '#888'}}>Amount Settled:</BoldText>

                <BoldText style={{fontSize: 18, color: '#888'}}>
                  ₹ {khata.data.settledAmount}/-
                </BoldText>
              </View>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 20,
                    color: khata.data.closed ? Colors.buttonbg : Colors.tint,
                  }}
                >
                  Amount Pending:
                </Text>

                <Text
                  style={{
                    fontSize: 20,
                    color: khata.data.closed ? Colors.buttonbg : Colors.tint,
                  }}
                >
                  ₹ {khata.data.totalAmount}/-
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={CommonStyles.section}>
          {/* <BoldText style={CommonStyles.sectionHeader}>
						Actions
					</BoldText> */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => fetchUrl()}
              style={{
                height: 50,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 5,
                backgroundColor: khata.data.closed ? 'transparent' : Colors.tint,
              }}
              disabled={fetching || khata.data.closed}
            >
              {fetching ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text
                  style={{
                    color: khata.data.closed ? Colors.buttonbg : Colors.tabIconDefault,
                  }}
                >
                  {khata.data.closed ? 'Settled' : 'Settle Account'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => boolPrivacy()}
              style={{
                flex: 1,
                height: 50,
                marginLeft: 5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#dd000088',
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{color: '#fff'}}>
                  {khata.data.private ? 'Share Details' : 'Hide Details'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={CommonStyles.section}>
          <BoldText style={CommonStyles.sectionHeader}>Orders</BoldText>

          <FlatList
            data={khata.data.orders}
            keyExtractor={e => e.orderId}
            renderItem={({item}) => <OrderDetails item={item} />}
          />
        </View>
      </View>
    </>
  );
}

export default function Accounts() {
  const {t, nav} = useServices();
  const [activeItem, setActiveItem] = useState<any>(null);

  const colorScheme = useColorScheme();

  const {accounts} = useSelector((state: any) => state.accountsReducer);

  useEffect(() => {
    if (activeItem !== null) {
      setActiveItem(accounts.find((e: any) => e.store.id === activeItem.store.id));
    }
  }, [accounts]);

  if (activeItem) {
    return (
      <>
        <Screen>
          <View style={CommonStyles.header}>
            <TouchableOpacity onPress={() => setActiveItem(null)}>
              <AntDesign name="back" size={SIZES.icon.header} color={Colors.tint} />
            </TouchableOpacity>
            <View style={CommonStyles.screenTitle}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}
              >
                <BoldText
                  style={{
                    ...CommonStyles.title,
                    width: '75%',
                    textAlign: 'left',
                  }}
                  numberOfLines={1}
                >
                  {activeItem.store.name}
                </BoldText>
                {activeItem.data.private && (
                  <AntDesign
                    name="lock1"
                    color={Colors.text}
                    size={SIZES.icon.normal}
                    style={{marginLeft: 10}}
                  />
                )}
              </View>
            </View>
          </View>
          {/* Actions on Account */}
          <KhataItem khata={activeItem} />
          {/* ------------------ */}
        </Screen>
      </>
    );
  }

  return (
    <>
      <DynamicStatusBar />
      <Screen>
        <Header title="Accounts" onBack={() => nav.pop()} />

        <Text style={styles.sectionText}>
          All <Text style={{color: Colors.tint}}>your accounts</Text> are managed here.
        </Text>

        {accounts.length !== 0 ? (
          <View style={{flex: 1, width: '100%'}}>
            <FlatList
              // onRefresh={() => refetch}
              // refreshing={
              // 	networkStatus === NetworkStatus.refetch
              // }
              key={9980234599}
              keyExtractor={(e: any) => e.store.id.toString()}
              data={accounts}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    ...styles.khataRow,
                    backgroundColor: item.data.closed ? '#11111106' : '#1ea47211',
                  }}
                  onPress={() => setActiveItem(item)}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <DisplayImg
                      name={item.store.name}
                      size={SIZES.icon.header - 10}
                      off={item.data.closed}
                    />

                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        paddingLeft: 10,
                      }}
                    >
                      <BoldText
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {item.store.name}
                      </BoldText>

                      <BoldText
                        style={{
                          color: item.data.closed ? Colors.tabIconDefault : Colors.tint,
                          fontSize: 12,
                        }}
                      >
                        {item.data.closed ? 'closed' : 'open'}
                      </BoldText>
                    </View>
                  </View>
                  <BoldText style={{fontSize: 18}}>₹ {item.data.totalAmount}/-</BoldText>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View style={CommonStyles.loadingContainer}>
            <BoldText style={{fontSize: 16}}>
              You currently have{' '}
              <BoldText style={{color: Colors.tint}}>no running accounts</BoldText>
            </BoldText>
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  sectionText: {fontSize: 18, marginBottom: 10, width: '100%'},
  actionBtn: {
    height: 30,
    width: 30,
    marginLeft: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  khataRow: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

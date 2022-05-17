import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Alert, FlatList, ActivityIndicator} from 'react-native';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Ionicons, AntDesign} from '@expo/vector-icons';
import {ImageLoader} from 'react-native-image-fallback';

import AddressTotalCard from '../AddressTotalCard';
import PaymentOptions from './PaymentOptions';
import DeliveryTime from './DeliveryTime';
import StoreSwitch from './StoreSwitch';
import EditCart from './EditCart';

import {CreateOrderLoader} from './Loader';
import {BoldText, Text} from '../../Common/Themed';
import {Button, CommonStyles, LoadingContainer, Section} from '../../Common/Elements';

import {emptyCart} from '../../../redux/Retail/actions';

import {validateCreateOrderInput} from '../../../utils/validators';
import {
  CREATE_ORDER,
  GET_DELIVERY_TIMES,
  GET_PAYMENT_OPTIONS,
  GET_TOTAL,
} from '../../../graphql/Retail/order';
import {networkUrls, SIZES} from '../../../utils/constants';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {CustomBackdrop, CustomBackground} from '../ModalStyle';
import useColorScheme from '../../../hooks/useColorScheme';
import {useServices} from '../../../services';
import {Colors} from 'react-native-ui-lib';

interface CreateOrderProps {
  bottomSheetModalRef: any;
  handleSheetChanges: any;
}

export default function CreateOrderBottomModal(props: CreateOrderProps) {
  const {t, nav} = useServices();
  const urls = networkUrls();
  const colorScheme = useColorScheme();
  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();

  const [delivery, setDelivery] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  const [deliveryTime, setDeliveryTime] = useState<any>({});
  const [toBeDelivered, setToBeDelivered] = useState<boolean>(true);

  const [deliveryScreen, setDeliveryScreen] = useState<boolean>(false);
  const [paymentScreen, setPaymentScreen] = useState<boolean>(false);
  const [editCart, setEditCart] = useState<boolean>(false);

  const [store, setStore] = useState<any>(null);

  const [payOnDelivery, setPayOnDelivery] = useState<boolean>(true);
  const [payment, setPayment] = useState<any>({});

  // states
  const {cart} = useSelector((state: any) => state.cartReducer);
  const {user} = useSelector((state: any) => state.userReducer);

  // total bill amount
  const [charges, setCharges] = useState({
    totalAmount: 0,
    deliveryCharge: 0,
    grandTotal: 0,
    convenienceFee: 0,
  });

  const snapPoints = useMemo(() => ['80%'], []);

  const {data: deliveryTimes, loading: gettingDeliveryTimes} = useQuery(GET_DELIVERY_TIMES, {
    onCompleted(data) {
      setDeliveryTime(data?.getDeliveryTimes[1]);
    },
    onError(err) {
      console.log(err);
    },
  });

  const {data: options, loading: gettingPaymentOptions} = useQuery(GET_PAYMENT_OPTIONS, {
    onCompleted(data) {
      setPayment(data?.getPaymentOptions[0].data[1]);
    },
    onError(err) {
      console.log(err);
    },
  });

  const [createOrder, {loading: creating}] = useMutation(CREATE_ORDER, {
    variables: {
      createOrderInput: {
        products: cart,
        totalAmount: charges.totalAmount.toString(),
        deliveryAmount: charges.deliveryCharge.toString(),
        convenienceFee: charges.convenienceFee.toString(),
        grandTotal: charges.grandTotal.toString(),
        transactionType: payment ? payment.type : '',
        storeId: store ? store?.id : '',
        transactionId: '',
        paid: payment.type === 'UPI' ? true : false,
        payOnDelivery,
        paymentDate: new Date().toISOString(),
        isDelivery: toBeDelivered,
        deliverBy: deliveryTime ? deliveryTime.n : '',
        deliveryAddress: delivery ? delivery : null,
      },
    },
    onCompleted(data) {
      if (data.createNewOrder) {
        dispatch(emptyCart([]));
        setDelivery(null);
        props.bottomSheetModalRef.current?.close();
        nav.push('RetailMain');
      }
    },
    onError(err) {
      if (process.env.NODE_ENV) {
        Alert.alert('Wait !!!', `${err}. Check order, try again!`);
        console.log(err);
        console.log({
          products: cart,
          totalAmount: charges.totalAmount.toString(),
          deliveryAmount: charges.deliveryCharge.toString(),
          convenienceFee: charges.convenienceFee.toString(),
          grandTotal: charges.grandTotal.toString(),
          transactionType: payment ? payment.type : '',
          transactionId: '',
          paid: payment.type === 'UPI' ? true : false,
          payOnDelivery,
          paymentDate: new Date().toISOString(),
          isDelivery: toBeDelivered,
          deliveryBy: deliveryTime ? deliveryTime.n : '',
          deliveryAddress: delivery ? delivery : null,
        });
      }
    },
  });

  const [getCharges, {loading}] = useLazyQuery(GET_TOTAL, {
    variables: {
      orderTotalInput: {
        totalAmount: charges.totalAmount.toString(),
        deliveryAddress: delivery ? delivery : null,
      },
    },
    onCompleted(data) {
      setCharges({
        ...charges,
        deliveryCharge: parseFloat(data.getTotal.deliveryCharge),
        grandTotal: parseFloat(data.getTotal.grandTotal),
      });
    },
    onError(err) {
      process.env.NODE_ENV && console.log(err);
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      props.bottomSheetModalRef.current?.close();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (user?.deliveryAddresses.length > 0) {
      setDelivery(user.deliveryAddresses[0]);
    }
  }, [user]);

  useEffect(() => {
    var tempAmount = 0;
    if (cart.length > 0) {
      cart.forEach((element: any) => {
        tempAmount += parseFloat(element.totalPrice);
      });
    } else {
      props.bottomSheetModalRef.current?.close();
    }
    setCharges({
      ...charges,
      totalAmount: tempAmount,
    });
    if (tempAmount > 0) {
      getCharges();
    }
  }, [cart]);

  useEffect(() => {
    const {valid} = validateCreateOrderInput(delivery, payment, store);
    setIsValid(valid);
  }, [delivery, payment, store]);

  function DeliveryDetails() {
    return (
      <View style={{flex: 1}}>
        <View style={CommonStyles.header}>
          <TouchableOpacity onPress={() => setDeliveryScreen(false)}>
            <AntDesign name="back" size={SIZES.icon.header} color={Colors.text} />
          </TouchableOpacity>

          <BoldText
            style={{
              fontSize: SIZES.font.header,
            }}
          >
            Select Address
          </BoldText>
        </View>
        <View style={{...styles.section, width: '100%', flex: 1}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={user.deliveryAddresses}
            contentContainerStyle={{
              borderRadius: 10,
              alignItems: 'center',
            }}
            keyExtractor={e => Math.random().toFixed(4)}
            renderItem={({item}) => (
              <TouchableOpacity
                delayPressIn={0}
                activeOpacity={0.6}
                onPress={() => handleAddress(item)}
                style={{
                  ...CartSheetStyles.deliveryContainer,
                  borderColor: item.coordinates === delivery?.coordinates ? '#1ea472' : '#bbb',
                }}
              >
                <BoldText
                  style={{
                    color: item.coordinates === delivery?.coordinates ? '#1ea472' : '#111',
                    fontSize: SIZES.font.text,
                  }}
                >
                  {item.name}
                </BoldText>
                <Text
                  numberOfLines={1}
                  style={{
                    color: item.coordinates === delivery?.coordinates ? '#1ea472' : '#111',
                  }}
                >
                  {item.line1} {item.line2}
                </Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <Button
                label="Add New Address"
                fullWidth={true}
                onPress={() => {
                  props.bottomSheetModalRef.current?.close();
                  setDeliveryScreen(false);
                  nav.push('Addresses');
                }}
              />
            }
          />
        </View>
      </View>
    );
  }

  function PaymentDetails() {
    return (
      <>
        <View style={CommonStyles.header}>
          <TouchableOpacity onPress={() => setPaymentScreen(false)}>
            <AntDesign name="back" size={SIZES.icon.header} color={Colors.text} />
          </TouchableOpacity>

          <BoldText
            style={{
              fontSize: SIZES.font.header,
            }}
          >
            {t.do('screens.retail.modals.payments.title')}
          </BoldText>
        </View>

        <PaymentOptions
          active={payment}
          storeId={store}
          data={options.getPaymentOptions || []}
          onPress={(item: any) => handlePayment(item)}
          meta={store}
        />
      </>
    );
  }

  function OrderContainer() {
    return gettingDeliveryTimes || gettingPaymentOptions ? (
      <CreateOrderLoader />
    ) : (
      <>
        <View
          style={{
            ...styles.sheetContainer,
            flex: 1,
            alignItems: 'center',
          }}
        >
          <View style={CommonStyles.header}>
            <BoldText
              style={{
                fontSize: 25,
              }}
            >
              Cart Total
            </BoldText>
            <Text
              style={{
                fontSize: 20,
              }}
            >
              ₹ {charges.totalAmount.toString()}
            </Text>
          </View>
          <Section
            title="Set Address"
            body={
              <AddressTotalCard
                deliveryAddress={delivery}
                grandTotal={charges.grandTotal.toString()}
                disabled={false}
                onPress={() => setDeliveryScreen(true)}
                loading={loading}
              />
            }
          />

          <Section
            title="Breakdown"
            body={
              <View style={{marginLeft: '5%', backgroundColor: 'transparent'}}>
                <View style={styles.sectionRow}>
                  <BoldText>Cart Total</BoldText>
                  <Text style={{color: Colors.inputtext}}>₹ {charges.totalAmount} /-</Text>
                </View>

                <View style={styles.sectionRow}>
                  <BoldText>Delivery Charge</BoldText>
                  <Text style={{color: Colors.inputtext}}>₹ {charges.deliveryCharge} /-</Text>
                </View>
              </View>
            }
          />

          <Section
            title="Delivery Time"
            body={
              <DeliveryTime
                onPress={(item: any) => handleDeliveryTime(item)}
                active={deliveryTime}
                data={deliveryTimes.getDeliveryTimes || []}
              />
            }
          />

          <Section
            title="Store Choice"
            body={
              <>
                <StoreSwitch
                  onPress={(item: any) => setStore(item)}
                  storeId={store ? store.id : ''}
                  address={delivery}
                />
                {store && (
                  <Text>
                    Your order will be sent to <BoldText>{store.name}</BoldText>
                  </Text>
                )}
              </>
            }
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={{
              ...styles.actionbtn,
              flex: 1,
              height: 60,
              borderWidth: 1,
              borderColor: '#eee',
              backgroundColor: '#eee',
            }}
            onPress={() => setPaymentScreen(true)}
          >
            {loading ? (
              <ActivityIndicator color="##111" />
            ) : payment ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Text
                  style={{
                    color: '#111',
                    fontSize: 16,
                  }}
                >
                  {payment?.pre}
                </Text>
                <ImageLoader
                  source={`${urls.ICON_URI}${payment?.uri}`}
                  fallback={[`${urls.ICON_URI}imagedefault.png`]}
                  style={{
                    height: 30,
                    width: 30,
                    marginLeft: 8,
                  }}
                />
              </View>
            ) : (
              <Text>Choose payment</Text>
            )}
          </TouchableOpacity>
          <View style={{width: 10}} />
          <TouchableOpacity
            disabled={creating || !isValid}
            delayPressIn={0}
            style={{
              ...styles.actionbtn,
              flex: 1,
              height: 60,
              borderWidth: 1,
              borderColor: isValid ? '#1ea472' : '#333',
              backgroundColor: isValid ? '#1ea472' : '#333',
            }}
            onPress={() => createOrder()}
          >
            <BoldText style={{color: '#fff', fontSize: 16}}>
              {payment.mode === 'CASH' && 'Pay & '}Confirm
            </BoldText>
          </TouchableOpacity>
        </View>
        {/* <CheckoutBtn
					onSwipe={() => createOrder()}
					disabled={creating || payment === null || !toBeDelivered}
				/> */}
      </>
    );
  }

  function handlePayment(item: any) {
    setPayment(item);
    setPaymentScreen(false);
  }

  function handleAddress(item: any) {
    setToBeDelivered(true);
    setDelivery(item);
    setDeliveryScreen(false);
  }

  function handleDeliveryTime(item: any) {
    setDeliveryTime(item);
  }

  return (
    <>
      <BottomSheetModal
        ref={props.bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={props.handleSheetChanges}
        style={{
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.35,
          shadowRadius: 3.8,
          elevation: 10,
        }}
        key={1993049232}
        android_keyboardInputMode="adjustPan"
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
      >
        {creating ? (
          <LoadingContainer />
        ) : (
          <BottomSheetFlatList
            style={{
              width: '90%',
              flex: 1,
              paddingBottom: 20,
              flexDirection: 'column',
              alignSelf: 'center',
              marginBottom: '5%',
            }}
            data={[1]}
            showsVerticalScrollIndicator={false}
            keyExtractor={(e: any) => e.toString()}
            renderItem={() => <View />}
            ListFooterComponent={
              deliveryScreen ? (
                <DeliveryDetails />
              ) : paymentScreen ? (
                <PaymentDetails />
              ) : editCart ? (
                <EditCart onPressBack={() => setEditCart(false)} />
              ) : (
                <OrderContainer />
              )
            }
          />
        )}
      </BottomSheetModal>
    </>
  );
}

const CartSheetStyles = StyleSheet.create({
  inventoryProduct: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityText: {
    color: '#fff',
    marginHorizontal: 10,
  },
  productName: {
    color: '#222',
  },
  productMeta: {
    color: '#444',
  },
  itemQuantity: {
    marginLeft: 15,
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  deliveryTypeBtn: {
    paddingVertical: 5,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  deliveryContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    marginBottom: 10,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const styles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    flexDirection: 'column',
  },
  section: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 5,
    borderRadius: 10,
    padding: 5,
  },
  sectionText: {fontSize: 16, marginBottom: 5, color: '#666'},
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  actions: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
  },
  actiontext: {
    textTransform: 'uppercase',
    fontSize: 16,
    color: '#111',
  },
});

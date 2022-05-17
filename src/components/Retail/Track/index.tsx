import React, {useState, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import * as Location from 'expo-location';
import {useMutation} from '@apollo/client';

import {BoldText, Text, View} from '../../Common/Themed';
import {CommonStyles} from '../../Common/Elements';

import AddressTotalCard from '../AddressTotalCard';
import TrackHistory from './History';
import RateOrderBtn from './RateOrder';

import {DROP_ORDER} from '../../../graphql/Retail/order';

import {networkUrls, SIZES} from '../../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {setUserLocation} from '../../../redux/Common/actions';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  formatDistanceToNow,
} from 'date-fns';
import {Colors} from 'react-native-ui-lib';

function FetchButton({id}: any) {
  // const [dispatchOrder, { loading }] = useMutation(DISPATCH_ORDER, {
  // 	variables: { orderId: id },
  // });
  return (
    <TouchableOpacity
      style={{
        ...trackStyles.actionbtn,
        flex: 1,
        borderWidth: 1,
        // borderColor: loading ? "#888" : "#333",
      }}
      // disabled={loading}
      // onPress={() => dispatchOrder()}
    >
      {/* {loading ? (
				<ActivityIndicator color={"#111"} />
			) : ( */}
      <BoldText style={trackStyles.actiontext}>Fetch Location</BoldText>
      {/* )} */}
    </TouchableOpacity>
  );
}

function CollectedButton({id, location}: any) {
  // const [deliveredOrder, { loading }] = useMutation(DELIVERED_ORDER, {
  // 	variables: {
  // 		orderId: id,
  // 		coordinates: location,
  // 	},
  // 	onError(err) {
  // 		Alert.alert("Cannot update delivery status", `${err}`, [
  // 			{ style: "default", text: "Okay" },
  // 		]);
  // 	},
  // });
  return (
    <TouchableOpacity
      style={{
        ...trackStyles.actionbtn,
        flex: 1,
        borderWidth: 1,
        // borderColor: loading ? "#555" : "#1ea472",
        // backgroundColor: loading ? "#555" : "#1ea472",
      }}
      // disabled={loading}
      // onPress={() => deliveredOrder()}
    >
      {/* {loading ? (
				<ActivityIndicator color={"#fff"} />
			) : ( */}
      <BoldText style={{...trackStyles.actiontext, color: '#fff'}}>Scan for Order</BoldText>
      {/* )} */}
    </TouchableOpacity>
  );
}

function CancelButton({id, over, dispatched, deliverBy}: any) {
  const [dropOrder, {loading}] = useMutation(DROP_ORDER, {
    variables: {orderId: id},
  });
  return (
    <TouchableOpacity
      style={{
        ...trackStyles.actionbtn,
        flex: 1,
        borderWidth: 1,
        borderColor: over || dispatched ? '#eee' : '#d00',
        backgroundColor: over || dispatched ? '#eee' : '#fff',
      }}
      onPress={() =>
        over || dispatched
          ? Alert.alert(
              'Too late to cancel',
              over
                ? `Order can only be cancelled within delivery time. Expected time to deliver this order was ${formatDistanceToNow(
                    new Date(deliverBy),
                  )}`
                : `Order cannot be cancelled once dispatched from the store.`,
              [
                {
                  text: 'Okay',
                  style: 'cancel',
                },
              ],
            )
          : Alert.alert(
              'Cancel Confirmation',
              `Store will be notified order #loc${id.toString().slice(16)} is cancelled.`,
              [
                {
                  style: 'default',
                  text: 'Okay',
                  onPress: () => dropOrder(),
                },
              ],
              {cancelable: true},
            )
      }
    >
      {loading ? (
        <ActivityIndicator color="#d00" />
      ) : (
        <Text
          style={{
            ...trackStyles.actiontext,
            color: over || dispatched ? '#fff' : '#d00',
          }}
        >
          Cancel Order
        </Text>
      )}
    </TouchableOpacity>
  );
}

function PayButton({id, paid}: any) {
  // const [fetchPayUri, { loading }] = useMutation(FETCH_PAY_URI, {
  // 	variables: { orderId: id },
  // });
  return (
    <TouchableOpacity
      style={{
        ...trackStyles.actionbtn,
        flex: 1,
        borderWidth: 1,
        borderColor: '#1ea472',
        backgroundColor: '#1ea472',
      }}
      // onPress={() => fetchPayUri()}
    >
      {false ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          style={{
            ...trackStyles.actiontext,
            color: '#fff',
          }}
        >
          Pay
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function TrackContent({data}: any) {
  // render map if user wants live location
  const [mapView, setMapView] = useState<boolean>(false);
  const dispatch: any = useDispatch();

  const snapPoints = useMemo(() => [SIZES.screen.width / 2], []);

  // timer
  const [confirmTimer, setConfirmTimer] = useState<number>(1);
  const urls = networkUrls();

  // track of time, delivery
  const [timer, setTimer] = useState({
    over: false,
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
  });

  // manners, bleh
  const [locationPermission, setLocationPermission] = useState<string | null>(null);
  const {location} = useSelector((state: any) => state.locationReducer);

  useEffect(() => {
    confirmTimer > 0 && setTimeout(() => setConfirmTimer(confirmTimer + 1), 1000);

    let currentTime = new Date();
    let expireTime = new Date(data.delivery.deliverBy);

    setTimer({
      over: currentTime > expireTime ? true : false,
      day: differenceInDays(new Date(expireTime), new Date(currentTime)) % 1,
      hour: differenceInHours(new Date(expireTime), new Date(currentTime)) % 24,
      min: differenceInMinutes(new Date(expireTime), new Date(currentTime)) % 60,
      sec: differenceInSeconds(new Date(expireTime), new Date(currentTime)) % 60,
    });

    askForLocationPermission();
  }, [confirmTimer]);

  const askForLocationPermission = () => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();

      setLocationPermission(status ? 'granted' : 'denied');

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        dispatch(
          setUserLocation({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          }),
        );
      }
    })();
  };

  if (locationPermission === null) {
    return (
      <View style={CommonStyles.container}>
        <BoldText style={CommonStyles.title}>
          Requesting location permissions to track delivery.
        </BoldText>
      </View>
    );
  }

  if (data.state.isDropped || data.state.isCancelled) {
    return (
      <View style={CommonStyles.container}>
        <View
          style={{
            ...CartSheetStyles.rowContainer,
            marginBottom: 10,
          }}
        >
          <BoldText style={{fontSize: 20}}>
            #loc
            {data.id.toString().slice(16)}
          </BoldText>
          <View
            style={{
              ...trackStyles.statusContainer,
              borderColor: '#aa3315',
            }}
          >
            <Text style={{color: '#aa3315'}}>Cancelled</Text>
          </View>
        </View>
        <View style={CommonStyles.loadingContainer}>
          <BoldText style={CommonStyles.title}>
            {data.state.isDropped
              ? 'You cancelled this order.'
              : "Couldn't find a store matching your order items."}
          </BoldText>
        </View>
      </View>
    );
  }

  return (
    <View style={{backgroundColor: 'red'}}>
      {/* delivery status */}
      <View
        style={{
          ...CartSheetStyles.rowContainer,
          marginBottom: 10,
        }}
      >
        <BoldText style={{fontSize: 20}}>
          #loc
          {data.id.toString().slice(16)}
        </BoldText>
        {data.state.isCancelled ? (
          <View
            style={{
              ...trackStyles.statusContainer,
              borderColor: '#aa3315',
            }}
          >
            <Text style={{color: '#aa3315'}}>Cancelled</Text>
          </View>
        ) : (
          <View
            style={{
              ...trackStyles.statusContainer,
              borderColor: data.state.isConfirmed ? '#1ea472' : '#636363',
            }}
          >
            <BoldText
              style={{
                color: data.state.isConfirmed ? '#1ea472' : '#636363',
              }}
            >
              {data.delivery.isDelivered
                ? 'Delivered'
                : data.state.isConfirmed
                ? 'Confirmed'
                : 'Not Confirmed'}
            </BoldText>
          </View>
        )}
      </View>

      {/* cart items */}

      <FlatList
        ListHeaderComponent={
          <>
            {!data.delivery.isDelivered && (
              <TouchableOpacity
                style={trackStyles.section}
                disabled={true}
                onPress={() => setMapView(true)}
              >
                <View style={CartSheetStyles.rowContainer}>
                  <BoldText style={trackStyles.sectionHeader}>
                    {timer.over ? 'Order late by' : 'Delivering in'}
                  </BoldText>
                </View>
                <BoldText
                  style={{
                    ...trackStyles.timeText,
                    color: timer.over ? Colors.$textDanger : Colors.$textDefault,
                    marginBottom: 0,
                  }}
                >
                  {timer.hour > 0 && (
                    <>
                      {timer.hour} <Text style={trackStyles.timeUnit}>hr</Text>{' '}
                    </>
                  )}
                  {timer.min} <Text style={trackStyles.timeUnit}>m</Text> {timer.sec}{' '}
                  <Text style={trackStyles.timeUnit}>s</Text>
                </BoldText>
              </TouchableOpacity>
            )}
            <BoldText
              style={{
                ...trackStyles.sectionHeader,
                margin: 5,
              }}
            >
              Cart Items
            </BoldText>
          </>
        }
        scrollEnabled={true}
        data={data.products}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: any) => e.id}
        renderItem={({item}: any) => (
          <View style={CartSheetStyles.inventoryProduct}>
            <View style={CartSheetStyles.rowContainer}>
              <Image
                source={{
                  uri: `${urls.IMG_URI}${item.imageUrl}.jpg`,
                }}
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
                    ...CartSheetStyles.productName,
                    width: '90%',
                  }}
                  numberOfLines={1}
                >
                  {item.name}
                </BoldText>
                <Text style={CartSheetStyles.productMeta}>
                  {item.quantity.count}
                  {item.quantity.type} x {item.itemQuantity}
                </Text>
              </View>

              <BoldText
                style={{
                  ...CartSheetStyles.productName,
                  textAlign: 'right',
                }}
              >
                ₹ {item.totalPrice}/-
              </BoldText>
            </View>
          </View>
        )}
        ListFooterComponentStyle={{marginBottom: 80, marginTop: 10}}
        ListFooterComponent={
          <>
            {/* delivery details */}

            <AddressTotalCard
              disabled={true}
              onPress={() => console.log('')}
              grandTotal={data.payment.grandTotal}
              deliveryAddress={data.delivery.deliveryAddress}
              loading={false}
            />

            {/* track timeline */}

            <BoldText
              style={{
                ...trackStyles.sectionHeader,
                margin: 10,
                marginBottom: 0,
              }}
            >
              Order Timeline
            </BoldText>
            <TrackHistory
              delivery={data.delivery}
              state={data.state}
              storeName={data.meta.storeName}
            />

            {data.delivery.isDelivered && <RateOrderBtn orderId={data.id} rating={data.rating} />}
            <View
              style={{
                ...trackStyles.section,
                borderWidth: 0,
                marginTop: 10,
              }}
            >
              <TouchableOpacity onPress={() => console.log('')}>
                <Text
                  style={{
                    color: Colors.$textDisabled,
                    textDecorationLine: 'underline',
                  }}
                >
                  Need Help? Click here for Order assistance
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />

      {/* action container  */}

      {/* {!data.delivery.isDelivered && (
				<View style={trackStyles.actions}>
					{!data.delivery.isDispatched && (
						<TouchableOpacity
							style={{
								...trackStyles.actionbtn,
								marginRight: 10,
								backgroundColor: timer.over
									? "#555"
									: "#dd0000",
							}}
							onPress={() =>
								timer.over
									? Alert.alert(
											"Too late to cancel",
											`Order can only be cancelled within delivery time. Expected time to deliver this order was before ${moment(
												data.delivery.deliverBy
											).format("ddd, hh:mm A")}`,
											[
												{
													text: "Okay",
													style: "cancel",
												},
											]
									  )
									: Alert.alert(
											"Cancel Confirmation",
											`Store will be notified order #loc
						${data.id.toString().slice(16)} is cancelled.`,
											[
												{
													style: "default",
													text: "Okay",
													onPress: () => dropOrder(),
												},
											]
									  )
							}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Ionicons
									name="close-outline"
									color="#fff"
									size={25}
								/>
							)}
						</TouchableOpacity>
					)}
					{data.delivery.isDispatched ? (
						<CollectedButton
							id={data.id.toString()}
							location={userLocation}
						/>
					) : (
						<FetchButton id={data.id.toString()} />
					)}
				</View>
			)} */}
      <View style={trackStyles.actions}>
        {data.state.isDropped ||
          (!data.delivery.isDelivered && (
            <CancelButton
              id={data.id}
              over={timer.over}
              dispatched={data.delivery.isDispatched}
              deliverBy={data.delivery.deliverBy}
            />
          ))}
        {/* {!data.state.isDropped && !data.payment.paid && (
					<>
						<View style={{ width: 10 }} />
						<PayButton id={data.id} paid={data.payment.paid} />
					</>
				)} */}
      </View>
    </View>
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
    backgroundColor: 'transparent',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
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
});

const trackStyles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 5,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1ea47222',
  },
  sectionText: {fontSize: 14, marginBottom: 5},
  sectionHeader: {fontSize: 16, marginBottom: 5},
  columnsection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '48%',
  },
  statusContainer: {
    borderRadius: 5,
    padding: 5,
    borderWidth: 0,
  },
  unitText: {width: '50%', textAlign: 'right'},
  timeText: {fontSize: 40},
  timeUnit: {fontSize: 35, color: Colors.$textDisabled},
  time: {},
  actions: {
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
    marginBottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '5%',
  },
  actionbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
  },
  actiontext: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: Colors.$textDefault,
  },
});

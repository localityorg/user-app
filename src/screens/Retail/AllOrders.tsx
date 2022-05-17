import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useServices} from '../../services';
import {CategoryBtn, Header, LoadingContainer, Screen} from '../../components/Common/Elements';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import * as Notifications from 'expo-notifications';
import {useQuery} from '@apollo/client';
import {GET_NEW_ORDER, GET_ORDERS} from '../../graphql/Retail/order';
import {setLastUserOrder, setUserOrders} from '../../redux/Retail/actions';
import {filterOrders} from '../../utils/filters';
import OrderCard from '../../components/Retail/Order/OrderCard';
import {FlatList} from 'react-native';
import {View} from '../../components/Common/Themed';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification(title: string, message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      data: {data: 'goes here'},
    },
    trigger: {
      seconds: 1,
    },
  });
}

const filters = [
  {id: 19349, name: 'Whole list'},
  {id: 19345, name: 'Delivered'},
  {id: 19348, name: 'Pending'},
  {id: 19347, name: 'Confirmed'},
  {id: 19346, name: 'Cancelled'},
];

export default function AllOrders() {
  const {nav, t} = useServices();

  const [filter, setFilter] = useState<any>(filters[0]);

  const [isRender, setIsRender] = useState(false);
  const [focusId, setFocusId] = useState(null);

  const dispatch: any = useDispatch();

  const bottomSheetTrackModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [380, '80%'], []);
  const handleSheetChanges = useCallback(() => {}, []);

  const {userOrders} = useSelector((state: any) => state.ordersReducer);
  const {user} = useSelector((state: any) => state.userReducer);

  const {
    data: allOrders,
    loading,
    subscribeToMore,
    refetch,
    networkStatus,
  } = useQuery(GET_ORDERS, {
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      dispatch(setUserOrders(data?.getOrders));
      setIsRender(!isRender);
      if (
        data.getOrders.length > 1 &&
        !data.getOrders[0].delivery.isDelivered &&
        !data.getOrders[0].state.isDropped &&
        !data.getOrders[0].state.isCancelled
      ) {
        dispatch(setLastUserOrder(data.getOrders[0]));
      }
    },
    onError(err) {
      process.env.NODE_ENV && console.log(err);
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_NEW_ORDER,
      variables: {id: user?.id},
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;
        const updatedQueryData = subscriptionData.data.newOrder;
        const index = prev.getOrders.findIndex((e: any) => e.id === updatedQueryData.id);

        dispatch(setLastUserOrder(updatedQueryData));

        if (index <= -1) {
          schedulePushNotification(
            'Order Placed.',
            'Nearest Shop in your locality recieved order!',
          );
          return Object.assign({}, prev, {
            getOrders: [updatedQueryData, ...prev.getOrders],
          });
        } else {
          var updatedOrders = [...prev.getOrders];
          updatedOrders.splice(index, 1);

          if (updatedQueryData.confirmed) {
            schedulePushNotification('Order Confirmed.', 'Your order will be dispatched soon');
          } else if (updatedQueryData.cancelled) {
            schedulePushNotification(
              'Order Cancelled.',
              "Hold tight! We're getting nearest shop in your locality",
            );
          }

          setIsRender(!isRender);
          dispatch(setUserOrders([updatedQueryData, ...updatedOrders]));

          return Object.assign({}, prev, {
            getOrders: [updatedQueryData, ...updatedOrders],
          });
        }
      },
      onError(err) {
        process.env.NODE_ENV && console.log(err);
      },
    });
    return unsubscribe;
  }, []);

  function handleFilter(item: any) {
    setFilter(item);
  }

  useEffect(() => {
    const filteredOrders = filterOrders(allOrders?.getOrders || [], filter);
    dispatch(setUserOrders(filteredOrders));
  }, [filter, allOrders]);

  function RenderItem({item}: any) {
    return (
      <OrderCard
        data={item}
        onPress={() => nav.show('RetailTrack', {id: item.id, back: 'AllOrders', data: item})}
      />
    );
  }

  const memoizedItem = useMemo(() => RenderItem, [allOrders?.getOrders]);

  if (loading || networkStatus === 4) {
    return <LoadingContainer />;
  }

  return (
    <Screen>
      <Header title={t.do('screens.allorders.title')} />

      <FlatList
        data={userOrders}
        ListHeaderComponent={
          <View style={{width: '100%', marginBottom: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={filters}
              keyExtractor={e => e.id.toString()}
              renderItem={({item}) => (
                <CategoryBtn
                  text={item.name}
                  active={item === filter}
                  onPress={() => handleFilter(item)}
                />
              )}
            />
          </View>
        }
        extraData={isRender}
        renderItem={memoizedItem}
        refreshing={loading || networkStatus < 7}
        onRefresh={() => refetch()}
        showsVerticalScrollIndicator={false}
        keyExtractor={e => e.id.toString()}
      />
    </Screen>
  );
}

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';

import {View} from '../../components/Common/Themed';
import {Header, Screen, Section} from '../../components/Common/Elements';
import {SearchBar} from '../../components/Retail/SearchBar';
import ProgressTracker from '../../components/Retail/Track/ProgressTracker';
import ProductItem from '../../components/Retail/ProductItem';

import {setStores} from '../../redux/Retail/actions';
import {GET_CONTENT} from '../../graphql/Retail/content';
import {GET_STORES} from '../../graphql/Retail/store';

import {useDispatch, useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/client';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {useServices} from '../../services';
import ProductSkuModal from '../../components/Retail/SkuModal';

export default function Main() {
  const {nav, t} = useServices();
  const dispatch: any = useDispatch();

  const [feed, setFeed] = useState<any>();
  const [product, setProduct] = useState<any>(null);

  const {stores} = useSelector((state: any) => state.storesReducer);
  const {location} = useSelector((state: any) => state.locationReducer);
  const {lastOrder} = useSelector((state: any) => state.ordersReducer);

  const skuSheetRef = useRef<BottomSheetModal>(null);

  const [fetchFeed, {loading, refetch, networkStatus}] = useLazyQuery(GET_CONTENT, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      setFeed(data.getContent);
    },
    onError(err) {
      console.log(err);
    },
  });

  const [fetchStores, {loading: fetchingStores}] = useLazyQuery(GET_STORES, {
    variables: {
      coordinates: location,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      dispatch(setStores(data.getAccountStores));
      fetchFeed();
    },
    onError(err) {
      console.log('Error fetching stores');
    },
  });

  function RenderItem({item}: any) {
    return item.skus.length > 0 ? (
      <ProductItem
        data={item}
        onPress={(item: any) => {
          setProduct(item);
        }}
      />
    ) : (
      <View />
    );
  }

  const memoizedItem = useMemo(() => RenderItem, [feed?.products]);

  useEffect(() => {
    if (product !== null) {
      skuSheetRef.current?.present();
    } else {
      skuSheetRef.current?.close();
    }
  }, [product]);

  useEffect(() => {
    if (location !== null) {
      fetchStores({
        variables: {
          coordinates: location,
        },
      });
    }
  }, [location]);

  return (
    <>
      {product && (
        <ProductSkuModal
          data={product}
          bottomSheetModalRef={skuSheetRef}
          discardProduct={() => setProduct(null)}
        />
      )}
      <Screen>
        <Header title={t.do('screens.retail.title')} onBack={() => nav.pop()} />

        <SearchBar
          nav={() => nav.push('SearchRetail', {name: '', category: ''})}
          placeholder={t.do('screens.retail.search.placeholder')}
        />

        <FlatList
          data={['1']}
          keyExtractor={e => e}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() =>
                fetchStores({
                  variables: {
                    coordinates: location,
                  },
                })
              }
            />
          }
          refreshing={loading || fetchingStores}
          renderItem={() => (
            <View style={{flex: 1, width: '100%'}}>
              <Section
                title="From your orders"
                body={
                  <View style={{width: '100%'}}>
                    <FlatList
                      data={feed?.products}
                      extraData={false}
                      listKey="9984124011"
                      contentContainerStyle={{
                        width: '100%',
                      }}
                      keyExtractor={e => e.id.toString()}
                      initialNumToRender={10}
                      renderItem={memoizedItem}
                      ListFooterComponentStyle={{
                        marginBottom: 75,
                      }}
                    />
                  </View>
                }
              />
              <Section
                title="Bought in your locality"
                body={
                  <View style={{width: '100%', paddingBottom: 100}}>
                    <FlatList
                      data={feed?.fromarea}
                      extraData={false}
                      listKey="9984124010"
                      contentContainerStyle={{
                        width: '100%',
                      }}
                      keyExtractor={e => e.id.toString()}
                      initialNumToRender={10}
                      renderItem={memoizedItem}
                      ListFooterComponentStyle={{
                        marginBottom: 45,
                      }}
                    />
                  </View>
                }
              />
            </View>
          )}
        />

        {lastOrder !== null && <ProgressTracker data={lastOrder} />}
      </Screen>
    </>
  );
}

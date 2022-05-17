import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, Keyboard} from 'react-native';

import {useLazyQuery} from '@apollo/client';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {AntDesign} from '@expo/vector-icons';
import {useSelector} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {BoldText, TextInput} from '../../components/Common/Themed';
import {CommonStyles, LoadingContainer, Screen} from '../../components/Common/Elements';

import ProductItem from '../../components/Retail/ProductItem';
import ProductSkuModal from '../../components/Retail/SkuModal';
import CartIcon from '../../components/Retail/Order/CartIcon';
import {SearchBar} from '../../components/Retail/SearchBar';
import CreateOrderBottomModal from '../../components/Retail/Order/Create';

import {GET_SEARCH_RESULTS} from '../../graphql/Retail/product';

import {ScreenProps} from '../../services/navigation/types';
type Props = NativeStackScreenProps<ScreenProps, 'SearchRetail'>;

import {useServices} from '../../services';
import {SIZES} from '../../utils/constants';

import {Colors} from 'react-native-ui-lib';

export default function SearchScreen({route}: Props) {
  const {name, category}: any = route.params;
  const {t, nav} = useServices();

  const {cart} = useSelector((state: any) => state.cartReducer);

  // create order modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback(() => {}, []);

  // sku item modal
  const bottomSheetSkuModalRef = useRef<BottomSheetModal>(null);

  const [search, setSearch] = useState<string>(name ? name : '');
  const [searchCategory, setSearchCategory] = useState<boolean>(category ? true : false);
  const [product, setProduct] = useState<any>(null);
  const [clickedFetch, setClickedFetch] = useState(false);

  const [fetchResults, {data, loading, fetchMore}] = useLazyQuery(GET_SEARCH_RESULTS, {
    variables: {
      name: search,
      category: searchCategory,
      offset: 0,
      limit: 10,
    },
    onError(err) {
      process.env.NODE_ENV && console.log(err);
    },
  });

  useEffect(() => {
    if (search?.trim().length !== 0) {
      fetchResults({
        variables: {
          name: search,
          category: searchCategory,
          offset: 0,
          limit: 10,
        },
      });
    }
  }, [search]);

  useEffect(() => {
    if (product !== null) {
      bottomSheetSkuModalRef.current?.present();
    } else {
      bottomSheetSkuModalRef.current?.close();
    }
  }, [product]);

  function RenderItem({item}: any) {
    return item.skus.length > 0 ? (
      <ProductItem
        data={item}
        onPress={(item: any) => {
          Keyboard.dismiss();
          setProduct(item);
        }}
      />
    ) : (
      <View />
    );
  }

  const memoizedItem = useMemo(() => RenderItem, [data?.getProducts]);

  const onLoadMore = () => {
    // fetchMore({
    // 	query: GET_SEARCH_RESULTS,
    // 	variables: {
    // 		offset: data.getProducts.length,
    // 	},
    // 	updateQuery: (prev, { fetchMoreResult }) => {
    // 		if (!fetchMoreResult) return prev;

    // 		return Object.assign({}, prev, {
    // 			getProducts: [
    // 				...prev.getProducts,
    // 				...fetchMoreResult.getProducts,
    // 			],
    // 		});
    // 	},
    // });
    console.log('Fetch More');
  };

  return (
    <>
      <CreateOrderBottomModal
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={handleSheetChanges}
      />
      {product && (
        <ProductSkuModal
          data={product}
          bottomSheetModalRef={bottomSheetSkuModalRef}
          discardProduct={() => setProduct(null)}
        />
      )}
      <Screen>
        <View style={CommonStyles.header}>
          <TouchableOpacity onPress={() => nav.push('Main')}>
            <AntDesign name="back" size={SIZES.icon.header} color={Colors.text} />
          </TouchableOpacity>
          <View
            style={{
              ...CommonStyles.screenTitle,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <BoldText style={CommonStyles.title}>Search</BoldText>

            {cart.length > 0 && (
              <View style={{marginTop: 10}}>
                <CartIcon
                  onPress={() => bottomSheetModalRef.current?.present()}
                  length={cart.length}
                />
              </View>
            )}
          </View>
        </View>
        <SearchBar
          value={search}
          placeholder={'Search Products'}
          autoFocus={true}
          onChange={(text: string) => {
            if (clickedFetch === true) {
              setClickedFetch(false);
            }
            if (searchCategory === true) {
              setSearchCategory(false);
            }
            setSearch(text);
          }}
        />

        {loading ? (
          <LoadingContainer />
        ) : data?.getProducts.length === 0 ? (
          <View style={CommonStyles.loadingContainer}>
            {/* <Image
								source={{
									uri: `${IMG_URI}feedback/no-results.png`,
								}}
								style={{
									width: 200,
									height: 200,
									marginBottom: 10,
								}}
							/> */}
            {search.length !== 0 && (
              <>
                <BoldText>Oops! Found no results for {search}</BoldText>
              </>
            )}
          </View>
        ) : (
          <FlatList
            data={data?.getProducts}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            onEndReached={onLoadMore}
            ListHeaderComponent={
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                {/* <View style={styles.categories}>
										<FlatList
											horizontal
											showsHorizontalScrollIndicator={
												false
											}
											data={categories}
											keyExtractor={(e) => e.genre}
											renderItem={({ item }) => (
												<TouchableOpacity
													style={styles.category}
													key={item.genre_id}
												>
													<Text
														style={
															styles.categoryText
														}
													>
														{item.genre}
													</Text>
												</TouchableOpacity>
											)}
										/>
									</View> */}
              </View>
            }
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            keyExtractor={(e: any) => e.id}
            style={{width: '100%'}}
            renderItem={memoizedItem}
          />
        )}
      </Screen>
    </>
  );
}

import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native';

import {ImageLoader} from 'react-native-image-fallback';

import {AntDesign} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';

import {BoldText, View} from '../Common/Themed';
import {Button, CommonStyles, LoadingContainer} from '../Common/Elements';

import {addToCart, removeFromCart} from '../../redux/Retail/actions';

import {SIZES} from '../../utils/constants';

import {networkUrls} from '../../utils/constants';
import {getCount} from '../../utils/help';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CustomBackdrop, CustomBackground} from './ModalStyle';
import useColorScheme from '../../hooks/useColorScheme';
import {useServices} from '../../services';
import {Colors} from 'react-native-ui-lib';

interface ProductSkuModalProps {
  data: any;
  bottomSheetModalRef: any;
  discardProduct: any;
}

interface SkuTileProps {
  item: any;
}

export function SkuCount(props: SkuTileProps) {
  const {cart} = useSelector((state: any) => state.cartReducer);
  const colorScheme = useColorScheme();
  const [count, setCount] = useState<number>(getCount(cart, props.item));

  const dispatch: any = useDispatch();

  useEffect(() => {
    setCount(parseFloat(cart.find((e: any) => e.id === props.item.id)?.itemQuantity || '0'));
  }, [props.item, cart]);

  return (
    <View style={{backgroundColor: 'transparent'}}>
      {count > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'transparent',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: Colors.tabIconDefault,
            borderRadius: 5,
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setCount(count - 1);
              dispatch(removeFromCart(props.item));
            }}
            style={{
              borderRadius: 20,
            }}
            disabled={count < 1}
          >
            <AntDesign name="minus" size={23} color={Colors.text} />
          </TouchableOpacity>

          <BoldText
            style={{
              fontSize: 16,
              marginHorizontal: 20,
            }}
          >
            {count}
          </BoldText>

          <TouchableOpacity
            onPress={() => {
              setCount(count + 1);
              dispatch(addToCart(props.item));
            }}
            style={{
              borderRadius: 20,
            }}
          >
            <AntDesign name="plus" size={23} color={Colors.tint} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setCount(count + 1);
            dispatch(addToCart(props.item));
          }}
          style={{marginRight: 10, backgroundColor: 'transparent'}}
        >
          <AntDesign name="plus" size={23} color={Colors.tint} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ProductSkuModal(props: ProductSkuModalProps) {
  const [product, setProduct] = useState<any>(props.data);
  const urls = networkUrls();
  const colorScheme = useColorScheme();
  const {nav} = useServices();
  const {cart} = useSelector((state: any) => state.cartReducer);

  const snapPoints = useMemo(() => [100 * product.skus.length + 170], []);
  const handleSheetChanges = useCallback(() => {}, []);

  return (
    <BottomSheetModal
      ref={props.bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
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
      key={111304929}
      onDismiss={() => {
        props.discardProduct();
      }}
      onChange={handleSheetChanges}
      android_keyboardInputMode="adjustPan"
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backdropComponent={CustomBackdrop}
      backgroundComponent={CustomBackground}
    >
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        {product.skus !== null ? (
          <FlatList
            style={{
              width: '90%',
              flex: 1,
              paddingBottom: 20,
              flexDirection: 'column',
              alignSelf: 'center',
              backgroundColor: 'transparent',
              marginBottom: '5%',
            }}
            key={1221223419}
            data={product.skus}
            showsVerticalScrollIndicator={false}
            keyExtractor={(e: any) => e.id.toString()}
            ListHeaderComponent={
              <View style={CommonStyles.header}>
                <TouchableOpacity onPress={() => props.discardProduct()}>
                  <AntDesign name="back" size={SIZES.icon.header} color={Colors.tint} />
                </TouchableOpacity>

                <BoldText
                  style={{
                    fontSize: 25,
                    marginLeft: 10,
                    textAlign: 'right',
                    maxWidth: '75%',
                  }}
                  numberOfLines={1}
                >
                  {product.skus[0].name}
                </BoldText>
              </View>
            }
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                  backgroundColor: 'transparent',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <ImageLoader
                    source={`${urls.IMG_URI}${item?.imageUrl}.jpg`}
                    fallback={[`${urls.ICON_URI}imagedefault.png`]}
                    style={{
                      height: 80,
                      width: 80,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <BoldText
                      style={{
                        color: '#666',
                        marginBottom: 5,
                      }}
                    >
                      {item.quantity.count} {item.quantity.type}
                    </BoldText>
                    <BoldText style={{fontSize: 16, lineHeight: 18}}>
                      ₹ {item?.price.mrp}/-
                    </BoldText>
                  </View>
                </View>
                <SkuCount item={item} />
              </View>
            )}
          />
        ) : (
          <LoadingContainer />
        )}
      </View>
      <View style={{backgroundColor: 'transparent', marginBottom: 10}}>
        {cart.length > 0 && (
          <Button
            transparent={true}
            label="View cart"
            fullWidth={true}
            onPress={() => {
              props.bottomSheetModalRef.current.close();
              nav.push('Cart');
            }}
          />
        )}
      </View>
    </BottomSheetModal>
  );
}

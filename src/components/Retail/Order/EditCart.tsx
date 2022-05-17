import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import {ImageLoader} from 'react-native-image-fallback';
import {useSelector} from 'react-redux';

import {BoldText, View, Text} from '../../Common/Themed';

import {networkUrls} from '../../../utils/constants';
import {CommonStyles} from '../../Common/Elements';

import {AntDesign} from '@expo/vector-icons';

import {SkuCount} from '../SkuModal';
import useColorScheme from '../../../hooks/useColorScheme';
import {Colors} from 'react-native-ui-lib';

interface EditCartProps {
  onPressBack: any;
}

export default function EditCart(props: EditCartProps) {
  const {cart} = useSelector((state: any) => state.cartReducer);
  const urls = networkUrls();
  const colorScheme = useColorScheme();

  return (
    <FlatList
      data={cart}
      showsVerticalScrollIndicator={false}
      keyExtractor={(e: any) => e.id.toString()}
      initialNumToRender={1}
      contentContainerStyle={{marginBottom: 10}}
      renderItem={({item}: any) => (
        <View style={CartSheetStyles.inventoryProduct}>
          <View style={CartSheetStyles.rowContainer}>
            <ImageLoader
              source={`${urls.IMG_URI}${item?.imageUrl}.jpg`}
              fallback={[`${urls.ICON_URI}imagedefault.png`]}
              style={{
                height: 40,
                width: 40,
                borderRadius: 10,
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
                  color: Colors.text,
                  width: '95%',
                }}
                numberOfLines={3}
              >
                {item.name}{' '}
                <Text
                  style={{
                    ...CartSheetStyles.productMeta,
                    color: Colors.tabIconDefault,
                  }}
                >
                  {item.quantity.count}
                  {item.quantity.type} x {item.itemQuantity}
                </Text>
              </BoldText>
              <BoldText
                style={{
                  ...CartSheetStyles.productName,
                  fontSize: 18,
                  color: Colors.text,
                }}
              >
                ₹ {item.totalPrice}/-
              </BoldText>
            </View>
            <SkuCount item={item} />
          </View>
        </View>
      )}
    />
  );
}

const CartSheetStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
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
    alignItems: 'flex-start',
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
    fontWeight: 'normal',
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

import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {ImageLoader} from 'react-native-image-fallback';

import {BoldText, Text} from '../Common/Themed';

import {networkUrls} from '../../utils/constants';
import SkeletonContent from 'react-native-skeleton-content';

interface ProductItemProps {
  data: any;
  onPress: any;
}

function ProductName(props: {brand: string; name: string}) {
  var productName;
  if (props.name.replace(/[^!.'?\s]/g, '').startsWith(props.brand.replace(/[^!.'?\s]/g, ''))) {
    productName = props.name.replace(props.brand + ' ', '');
  } else {
    productName = props.name;
  }
  return (
    <Text style={{fontSize: 14}} numberOfLines={2}>
      {productName}
    </Text>
  );
}

export default function ProductItem(props: ProductItemProps) {
  const [skuItem, setSkuItem] = useState<object | any>(props.data?.skus[0]);

  const url = networkUrls();

  function handlePress() {
    props.onPress(props.data);
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        width: '100%',
        borderRadius: 5,
        paddingTop: 0,
        padding: 5,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 5,
        }}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <ImageLoader
          source={`${url.IMG_URI}${skuItem?.imageUrl}.jpg`}
          fallback={[`${url.ICON_URI}imagedefault.png`]}
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
            flex: 1,
          }}
        >
          <ProductName brand={props.data.brand} name={props.data.name} />
          <BoldText style={{color: '#666', marginBottom: 5}}>{props.data.brand}</BoldText>
          <BoldText style={{fontSize: 16, lineHeight: 18}}>
            <Text style={{lineHeight: 18, color: '#888'}}>
              {props.data.skus.length > 1 && 'Starting at '}
            </Text>
            ₹ {skuItem?.price.mrp}/-
          </BoldText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

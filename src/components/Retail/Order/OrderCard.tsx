import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import {formatDistanceToNow, parseISO} from 'date-fns';
import {Text} from '../../Common/Themed';
import {SIZES} from '../../../utils/constants';
import useColorScheme from '../../../hooks/useColorScheme';
import {Seperator} from '../../Common/Elements';
import AddressTotalCard from '../AddressTotalCard';
import {Colors} from 'react-native-ui-lib';

export default function OrderCard({data, onPress}: any) {
  const [orderData, setOrderData] = useState(data);
  const colorScheme = useColorScheme();

  if (data.state.isDropped || data.state.isCancelled) {
    return (
      <TouchableOpacity
        style={{
          ...styles.orderContainer,
          backgroundColor: 'transparent',
          borderColor: '#dd000055',
          padding: 10,
        }}
        activeOpacity={0.7}
        disabled={true}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
          }}
        >
          <Text style={{fontWeight: '600', fontSize: SIZES.font.text}}>
            <Text style={{color: '#666'}}>Id:</Text> #loc
            {data.id.toString().slice(16)}
          </Text>
          <Text
            style={{
              borderRadius: 10,
              color: '#dd000055',
            }}
          >
            cancelled
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.orderContainer,
        borderColor: orderData.delivery.isDelivered ? '#11111105' : Colors.buttonbg,
        paddingTop: 10,
        minHeight: 180,
      }}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
          marginBottom: 5,
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            color: '#888',
          }}
        >
          {formatDistanceToNow(parseISO(data.date))}
        </Text>

        <Text
          style={{
            borderRadius: data.payment.paid ? 0 : 3,
            padding: data.payment.paid ? 0 : 2,
            backgroundColor: data.payment.paid ? 'transparent' : Colors.background,
            color: data.payment.paid ? Colors.tint : Colors.text,
          }}
        >
          {data.payment.paid ? 'paid' : 'unpaid'}
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
          marginBottom: 5,
          justifyContent: 'space-between',
        }}
      >
        <Text style={{fontWeight: '600'}}>
          <Text style={{color: '#666'}}>Id:</Text> loc
          {orderData.id.toString().slice(16)}
        </Text>
        <Text
          style={{
            borderRadius: 10,
            color: orderData.delivery.isDelivered ? Colors.tint : Colors.text,
          }}
        >
          {!data.delivery.isDelivered ? 'not delivered' : 'delivered'}
        </Text>
      </View>
      <View style={styles.products}>
        {orderData.products.map((obj: any) => (
          <View style={styles.product} key={obj.id}>
            <View style={styles.productText}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.$textNeutral,
                  width: '75%',
                }}
                numberOfLines={1}
              >
                {obj.name}
              </Text>
              <Text>
                {obj.itemQuantity} x {obj.quantity.count}
                {obj.quantity.type}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Seperator />
      <AddressTotalCard
        deliveryAddress={orderData.delivery.deliveryAddress}
        disabled={true}
        grandTotal={orderData.payment.grandTotal}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },
  products: {
    flexDirection: 'column',
  },
  product: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productText: {
    flex: 1,
    width: '100%',
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

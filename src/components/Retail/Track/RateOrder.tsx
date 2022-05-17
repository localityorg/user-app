import React, {useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import {BoldText, Text, View} from '../../Common/Themed';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {useMutation} from '@apollo/client';

import {RATE_ORDER} from '../../../graphql/Retail/order';

interface RateOrderBtnProps {
  orderId: string;
  rating: number;
}

export default function RateOrderBtn(props: RateOrderBtnProps) {
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  const [ratingOrder, {loading}] = useMutation(RATE_ORDER, {
    variables: {
      orderId: props.orderId,
      rating,
    },
    onCompleted(data) {
      setRated(data.rateOrder);
    },
    onError(err) {
      process.env.NODE_ENV && console.log(err);
    },
  });

  useEffect(() => {
    if (props.rating !== null) {
      setRated(true);
      setRating(props.rating);
    }
  }, [props.rating]);

  if (rated) {
    return (
      <View style={styles.deliveryContainer}>
        <View style={styles.contentStyle}>
          <Text style={styles.deliverytitle}>Delivery Rating</Text>
        </View>
        <View style={styles.ratings}>
          {[1, 2, 3, 4, 5].map(obj => (
            <TouchableOpacity key={obj} onPress={() => setRating(obj)} disabled={rated}>
              <AntDesign
                name={obj <= rating ? 'star' : 'staro'}
                size={25}
                color={obj <= rating ? '#1ea472' : '#cfbebe'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.deliveryContainer}>
      {rating === 0 && (
        <View style={styles.contentStyle}>
          <BoldText style={styles.deliverytitle}>Delivery Rating</BoldText>
        </View>
      )}
      <View style={styles.ratings}>
        {[1, 2, 3, 4, 5].map(obj => (
          <TouchableOpacity key={obj} onPress={() => setRating(obj)}>
            <AntDesign
              name={obj <= rating ? 'star' : 'staro'}
              size={25}
              color={obj <= rating ? '#ffcc00' : '#cfbebe'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {rating !== 0 &&
        (!loading ? (
          <TouchableOpacity
            style={{
              ...styles.contentStyle,
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: '#1ea472',
            }}
            onPress={() => ratingOrder()}
          >
            <Text style={{color: '#fff'}}>Rate order</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator color="#1ea472" />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  deliveryContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  deliverytitle: {
    fontSize: 16,
  },
  contentStyle: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

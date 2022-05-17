import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import moment from 'moment';
import {Ionicons} from '@expo/vector-icons';

import {View, BoldText, Text} from '../../Common/Themed';

export interface CardProps {
  delivery: any;
  state: any;
  storeName: string;
}

export interface TimelineProps {
  active: boolean;
}

const TimelineLine = (props: TimelineProps) => {
  return (
    <View
      style={{
        height: '100%',
        width: 2,
        marginRight: 2,
        backgroundColor: `${() => (props.active ? '#1ea472' : '#666')}`,
      }}
    />
  );
};

export default function History(props: CardProps) {
  const [timeline, setTimeline] = useState([
    {
      id: '86597',
      show: props.delivery.isDelivered,
      bool: props.delivery.isDelivered,
      text: 'Delivered',
      subtext: moment(props.delivery.deliveryDate).format('ddd, hh:mm A'),
    },
    {
      id: '86598',
      show: props.delivery.isDispatched,
      bool: props.delivery.isDispatched,
      text: 'Dispatched',
      subtext: moment(props.delivery.dispatchDate).format('ddd, hh:mm A'),
    },
    {
      id: '86599',
      show: true,
      bool: props.state.isConfirmed,
      text: props.state.isConfirmed ? 'Confirmed' : 'Awaiting Confirmation',
      subtext: props.state.isConfirmed
        ? `${props.storeName} confirmed your order`
        : `Waiting for ${props.storeName} to confirm your order`,
    },
  ]);

  useEffect(() => {
    setTimeline([
      {
        id: '86597',
        show: props.delivery.isDelivered,
        bool: props.delivery.isDelivered,
        text: 'Delivered',
        subtext: moment(props.delivery.deliveryDate).format('ddd, hh:mm A'),
      },
      {
        id: '86598',
        show: props.delivery.isDispatched,
        bool: props.delivery.isDispatched,
        text: 'Dispatched',
        subtext: moment(props.delivery.dispatchDate).format('ddd, hh:mm A'),
      },
      {
        id: '86599',
        show: true,
        bool: props.state.isConfirmed,
        text: props.state.isConfirmed ? 'Confirmed' : 'Awaiting Confirmation',
        subtext: props.state.isConfirmed
          ? `${props.storeName} confirmed your order`
          : `Waiting for ${props.storeName} to confirm your order`,
      },
    ]);
  }, [props]);

  return (
    <View style={styles.container}>
      {timeline.map(
        obj =>
          obj.show && (
            <View style={styles.timelineContainer} key={obj.id}>
              <View style={styles.timeline}>
                <Ionicons
                  name={obj.bool ? 'radio-button-on' : 'radio-button-off'}
                  color={obj.bool ? '#1ea472' : '#666'}
                  size={20}
                  style={{paddingBottom: 15}}
                />
                <TimelineLine active={obj.bool} />
              </View>
              <View style={styles.section}>
                <BoldText style={styles.sectionHeader}>{obj.text}</BoldText>
                <Text style={styles.sectionText}>{obj.subtext}</Text>
              </View>
            </View>
          ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
  },
  timelineContainer: {
    width: '100%',
    flexDirection: 'row',
    maxHeight: 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timeline: {
    width: '10%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  section: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    paddingTop: 0,
  },
  sectionHeader: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
  },
  sectionText: {
    fontSize: 13,
    color: '#111',
  },
});

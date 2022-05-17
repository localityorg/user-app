import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, Animated} from 'react-native';

import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';

import TrackContent from '../TrackContent';
import {View, Text, BoldText} from '../../Common/Themed';
import {LoadingContainer} from '../../Common/Elements';
import useColorScheme from '../../../hooks/useColorScheme';
import {useServices} from '../../../services';

interface ProgressTrackerProps {
  data: any;
}

export default function ProgressTracker(props: ProgressTrackerProps) {
  const [text, setText] = useState('Order reached nearest store.');
  const [progress, setProgress] = useState<number>(20);
  const anim = useRef(new Animated.Value(1));
  const {nav, t} = useServices();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (props.data.state.isConfirmed) {
      setProgress(40);
      setText('Order is getting packed.');
    }
    if (props.data.delivery.isDispatched) {
      setProgress(75);
      setText('Order is out for delivery.');
    }
  }, [props.data]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.current, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <>
      {/* {!props.data ? <LoadingContainer /> : <TrackContent data={props.data} />} */}

      {props.data.state.isDropped ||
        (!props.data.delivery.isDelivered && (
          <TouchableOpacity
            style={{
              ...styles.trackActionBtn,
              backgroundColor: '#111111dd',
            }}
            onPress={() => nav.show('RetailTrack', {id: props.data.id, back: ''})}
            activeOpacity={0.8}
          >
            <Animated.View
              style={{
                ...styles.trackActionBtnProgress,

                backgroundColor: '#222222',
                width: `${progress}%`,
                transform: [{scaleX: anim.current}],
              }}
            />
            <SimpleLineIcons color="#ddd" name="bag" size={20} />
            <View style={styles.trackActionBtnTextContainer}>
              <Text style={styles.trackActionBtnText}>{text}</Text>
              <BoldText style={styles.trackActionBtnText2}>
                #loc{props.data.id.toString().slice(16)}
              </BoldText>
            </View>
            <Ionicons name="chevron-forward-outline" size={25} color="white" />
          </TouchableOpacity>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  trackActionBtn: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    height: 60,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#17171744',
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    overflow: 'hidden',
  },
  trackActionBtnProgress: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    backgroundColor: '#171717dd',
    borderRadius: 10,
    padding: 10,
  },
  trackActionBtnTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  trackActionBtnText: {
    fontSize: 12,
    color: '#eee',
  },
  trackActionBtnText2: {
    fontSize: 16,
    color: '#eee',
  },
});

import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';

import {useServices} from '../../services';
import {SIZES} from '../../utils/constants';
import {AntDesign} from '@expo/vector-icons';
import {BoldText} from '../Common/Themed';
import {Colors} from 'react-native-ui-lib';

interface DisplayImgProps {
  name: string;
  size?: number;
  off?: boolean;
}

export default function DisplayImg(props: DisplayImgProps) {
  const {nav} = useServices();

  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (props.name) {
      setName(props.name.slice(0, 1));
    }
  }, [props.name]);

  if (name) {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: props.off ? '#555' : Colors.$backgroundDisabled,
          justifyContent: 'center',
          alignItems: 'center',
          width: props.size ? props.size + 20 : '100%',
          height: props.size ? props.size + 20 : '100%',
          borderRadius: 10,
          zIndex: 0,
        }}
        onPress={() => nav.push('Profile')}
      >
        <BoldText
          style={{
            fontSize: props.size ? props.size : 35,
            zIndex: 2,
          }}
        >
          {name}
        </BoldText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={() => nav.push('Login')} activeOpacity={SIZES.opacity.active}>
      <AntDesign name="user" size={SIZES.icon.header} color={Colors.text} />
    </TouchableOpacity>
  );
}

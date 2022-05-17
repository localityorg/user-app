import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen');

export const useConstants = () => {
  const dim = Dimensions.get('screen');

  return {
    dim,
    links: {
      github: 'https://github.com/localityin/app',
      website: 'https://www.getlocality.in',
    },
  };
};

export const networkUrls = () => {
  return {
    BASE_URI: 'locality-serv1.getlocality.in',

    // static urls
    IMG_URI: `https://locality-static.getlocality.in/img/`,
    ICON_URI: 'https://locality-static.getlocality.in/icon/',

    // helper urls
    HELP_URL: 'https://www.getlocality.in/help?q=user',
    ORDER_URL: 'https://www.getlocality.in/help?q=order',
  };
};

const tintColorLight = '#1ea472';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',

    inputbg: '#fff',
    inputtext: '#111',
    inputborder: '#888',

    buttonbg: '#eee',
    buttontext: tintColorLight,

    tint: tintColorLight,

    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',

    inputbg: '#222',
    inputtext: '#ccc',
    inputborder: '#888',

    buttonbg: '#555',
    buttontext: '#fff',

    tint: tintColorDark,

    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const SIZES = {
  screen: {
    height: height,
    width: width,
  },
  icon: {
    header: 23,
    normal: 20,
    small: 18,
  },
  font: {
    header: 30,
    title: 18,
    text: 16,
    small: 12,
  },
  opacity: {
    active: 0.8,
    thumbnail: 0.5,
  },
};

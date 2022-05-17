/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
} from 'react-native';

import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';

import useColorScheme from '../../hooks/useColorScheme';
import {Colors} from 'react-native-ui-lib';

export function useThemeColor(
  props: {light?: string; dark?: string},
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

export function Text(props: TextProps) {
  let [fontsLoaded] = useFonts({
    Text: require('../../../assets/fonts/Inter-Regular.ttf'),
  });
  const {style, lightColor, darkColor, ...otherProps} = props;
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <DefaultText style={[{color, fontFamily: 'Text'}, style]} {...otherProps} />;
  }
}

export function BoldText(props: TextProps) {
  let [fontsLoaded] = useFonts({
    BoldText: require('../../../assets/fonts/Inter-Bold.ttf'),
  });
  const {style, lightColor, darkColor, ...otherProps} = props;
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <DefaultText style={[{color, fontFamily: 'BoldText'}, style]} {...otherProps} />;
  }
}

export function Title(props: TextProps) {
  let [fontsLoaded] = useFonts({
    Title: require('../../../assets/fonts/Inter-Bold.ttf'),
  });
  const {style, lightColor, darkColor, ...otherProps} = props;
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <DefaultText style={[{color, fontFamily: 'Title'}, style]} {...otherProps} />;
  }
}

export function TextInput(props: TextInputProps) {
  let [fontsLoaded] = useFonts({
    Input: require('../../../assets/fonts/Inter-Regular.ttf'),
  });
  const {style, lightColor, darkColor, ...otherProps} = props;
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return <DefaultTextInput style={[{color, fontFamily: 'Input'}, style]} {...otherProps} />;
  }
}

export function View(props: ViewProps) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background');

  return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}

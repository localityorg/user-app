import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {AntDesign} from '@expo/vector-icons';

import DynamicStatusBar from './StatusBar';
import {BoldText, Text, View, TextInput} from './Themed';

import useColorScheme from '../../hooks/useColorScheme';

import {SIZES} from '../../utils/constants';
import {Colors} from 'react-native-ui-lib';

export const CommonStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    marginVertical: 10,
    maxWidth: '75%',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: SIZES.font.header,
  },
  // section styles
  section: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  sectionHeader: {fontSize: SIZES.font.title, marginBottom: 10, backgroundColor: 'transparent'},
  sectionText: {fontSize: SIZES.font.text, marginBottom: 5},
  // link
  linkContainer: {
    marginVertical: 5,
  },
  linkText: {
    color: '#0084ff',
    textDecorationLine: 'underline',
    textDecorationColor: '#555',
  },
  // thumbnail
  thumbnail: {
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    zIndex: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  saveBtn: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
  // search
  search: {
    flex: 1,
    marginTop: 5,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.font.text,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  // actions
  actionBtnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: '5%',
  },
  // errors
  errorContainer: {
    width: '100%',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  errorText: {
    color: '#dd0000',
    fontSize: 14,
    textAlign: 'center',
  },
});

export const CartSheetStyles = StyleSheet.create({
  inventoryProduct: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  quantityText: {
    marginHorizontal: 10,
  },
  itemQuantity: {
    marginLeft: 15,
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function LoadingContainer() {
  return (
    <View style={CommonStyles.loadingContainer}>
      <ActivityIndicator color={Colors.tint} size="large" />
    </View>
  );
}

interface HeaderProps {
  onBack?: any;
  onNext?: any;
  title: string;
  focused?: boolean;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
}

export function Header(props: HeaderProps) {
  return (
    <View style={CommonStyles.header}>
      {props.onBack && (
        <TouchableOpacity
          onPress={props.onBack}
          style={{
            backgroundColor: props.focused ? Colors.background : 'transparent',
            padding: props.focused ? 10 : 0,
            borderRadius: props.focused ? SIZES.icon.header : 0,
          }}
        >
          <AntDesign name="back" size={SIZES.icon.header} color={Colors.text} />
        </TouchableOpacity>
      )}
      <View
        style={{
          ...CommonStyles.screenTitle,
          backgroundColor: props.focused ? Colors.background : 'transparent',
          padding: props.focused ? 2 : 0,
          paddingHorizontal: props.focused ? 10 : 0,
          borderRadius: props.focused ? SIZES.icon.normal : 0,
        }}
      >
        <BoldText numberOfLines={1} style={CommonStyles.title}>
          {props.title}
        </BoldText>
      </View>

      {props.onNext && (
        <TouchableOpacity
          onPress={props.onNext}
          style={{
            backgroundColor: props.focused ? Colors.background : 'transparent',
            padding: props.focused ? 5 : 0,
            borderRadius: props.focused ? SIZES.icon.header : 0,
          }}
        >
          <AntDesign name={props.icon} size={SIZES.icon.header} color={Colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface ScreenProps {}

export function Screen(props: ScreenProps) {
  return (
    <>
      <DynamicStatusBar />
      <View style={CommonStyles.container} {...props} />
    </>
  );
}

interface SectionProps {
  title: string;
  subtitle?: string;
  body: any;
  horizontal?: boolean;
  onPressInfo?: any;
  loading?: boolean;
}

export function Section(props: SectionProps) {
  return (
    <View style={CommonStyles.section}>
      <View style={CommonStyles.sectionHeaderRow}>
        <BoldText style={CommonStyles.sectionHeader}>{props.title}</BoldText>
        {props.onPressInfo && (
          <TouchableOpacity onPress={props.onPressInfo}>
            <AntDesign name="infocirlceo" color={Colors.text} size={SIZES.icon.small} />
          </TouchableOpacity>
        )}
        {props.loading && <ActivityIndicator color={Colors.tint} size="small" />}
      </View>
      {props.subtitle && <Text style={CommonStyles.sectionText}>{props.subtitle}</Text>}

      <View
        style={{
          flexDirection: props.horizontal ? 'row' : 'column',
          backgroundColor: 'transparent',
        }}
      >
        {props.body}
      </View>
    </View>
  );
}

interface LinkProps {
  uri: string;
  displayText: string;
  retry?: boolean;
}

export function Link(props: LinkProps) {
  async function handleUrl() {
    return Linking.canOpenURL(props.uri)
      .then(() => {
        Linking.openURL(props.uri).catch(err =>
          Alert.alert(
            `Error Occured`,
            `${err}`,
            [
              {
                text: props.retry ? 'Try Again' : 'Okay',
                onPress: () => {
                  props.retry && handleUrl();
                },
              },
            ],
            {
              cancelable: true,
            },
          ),
        );
      })
      .catch(err => console.log(`Error Occured: ${err}`));
  }
  return (
    <TouchableOpacity
      activeOpacity={SIZES.opacity.active}
      onPress={handleUrl}
      style={CommonStyles.linkContainer}
    >
      <Text style={CommonStyles.linkText}>{props.displayText}</Text>
    </TouchableOpacity>
  );
}

interface ButtonProps {
  onPress: any;
  label: string;
  name?: React.ComponentProps<typeof AntDesign>['name'];
  icon?: boolean;
  fullWidth?: boolean;
  transparent?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: props.fullWidth ? '100%' : '50%',
        alignSelf: props.fullWidth ? 'baseline' : 'auto',
        backgroundColor: props.transparent ? 'transparent' : Colors.$backgroundDisabled,
      }}
      activeOpacity={SIZES.opacity.active}
      disabled={props.disabled || false}
    >
      {props.loading ? (
        <ActivityIndicator color={Colors.tint} />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: props.icon ? 'flex-start' : 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
        >
          {props.icon && (
            <AntDesign
              name={props.name}
              color={Colors.text}
              size={SIZES.icon.normal}
              style={{marginRight: 10}}
            />
          )}
          <Text
            style={{
              color: Colors.text,
              fontSize: SIZES.font.text,
            }}
          >
            {props.label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface VideoThumbnailProps {
  onPress: any;
  imageUri: string;
  saved?: boolean;
  pressSave?: any;
  size?: number;
  width?: number;
  progress?: number;
  disabled?: boolean;
}

export function VideoThumbnai(props: VideoThumbnailProps) {
  return (
    <View
      style={{
        ...CommonStyles.thumbnail,
        height: props.size || 150,
        width: props.width || '100%',
        shadowColor: Colors.tabIconDefault,
        marginRight: props.size ? 10 : 0,
        borderRadius: props.size ? 10 : 0,
        marginBottom: props.size ? 0 : 10,
        overflow: 'hidden',
      }}
    >
      <ImageBackground
        source={{uri: props.imageUri}}
        style={{flex: 1, zIndex: -11}}
        resizeMode="cover"
      >
        {props.pressSave && (
          <TouchableOpacity
            onPress={props.pressSave}
            style={{
              backgroundColor: 'transparent',
              shadowColor: Colors.background,
              zIndex: 3,
              ...CommonStyles.saveBtn,
            }}
            disabled={props.disabled || false}
            activeOpacity={SIZES.opacity.active}
          >
            <AntDesign
              name={props.saved ? 'heart' : 'hearto'}
              size={SIZES.icon.normal}
              color={props.saved ? Colors.tint : Colors.tabIconDefault}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{flex: 1, zIndex: 2}}
          onPress={props.onPress}
          disabled={props.disabled || false}
          activeOpacity={SIZES.opacity.thumbnail}
        />
      </ImageBackground>
      {props.progress && (
        <View
          style={{
            width: props.width,
            height: 3,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            backgroundColor: Colors.tabIconDefault,
          }}
        >
          <View
            style={{
              height: 3,
              width: props.width
                ? props.width * props.progress
                : Dimensions.get('window').width * 0.9 * props.progress,
              backgroundColor: Colors.tint,
            }}
          />
        </View>
      )}
    </View>
  );
}

interface CategoryBtnProps {
  onPress: any;
  active: boolean;
  text: string;
  disabled?: boolean;
}

export function CategoryBtn(props: CategoryBtnProps) {
  return (
    <TouchableOpacity
      activeOpacity={SIZES.opacity.active}
      style={{
        opacity: props.disabled ? 0.5 : 1,
        borderColor: Colors.tint,
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: props.active ? Colors.tint : 'transparent',
      }}
      onPress={props.onPress}
      disabled={props.disabled || false}
    >
      <Text
        style={{
          color: props.active ? Colors.$backgroundDefault : Colors.tint,
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

interface StickerProps {
  uri: string;
}

export default function Sticker(props: StickerProps) {
  const [size, setSize] = useState({
    height: 100,
    width: 200,
  });

  useEffect(() => {
    Image.getSize(props.uri, (width, height) => {
      setSize({
        width: width,
        height: height,
      });
    });
  }, []);

  return <Image source={{uri: props.uri}} style={{height: size.height, width: size.width}} />;
}

interface InputProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: any;
  error?: boolean;
  errorMessage?: string;
  constraint?: any;
  maxLength?: number;
  autoFocus?: boolean;
  autoCapitalize?: string;
  keyboardType?: string;
  autoCorrect?: boolean;
  mini?: boolean;
  search?: boolean;
  locked?: boolean;
}

export function InputText(props: InputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <View
      style={{
        ...styles.inputContainer,
        width: props.mini ? '50%' : '100%',
        marginRight: props.mini ? 10 : 0,
      }}
    >
      <BoldText
        style={{
          marginBottom: 5,
          color: props.locked ? '#666' : focus ? Colors.text : Colors.tint,
          fontSize: SIZES.font.small,
        }}
      >
        {props.title}
      </BoldText>
      <View
        style={{
          ...styles.inputStyle,
          backgroundColor: 'transparent',
        }}
      >
        <TextInput
          placeholder={props.placeholder}
          value={props.value}
          onChangeText={text => props.onChange(text)}
          style={{
            flex: 1,
            marginRight: 10,
            fontSize: SIZES.font.text,
          }}
          placeholderTextColor={Colors.tabIconDefault}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          editable={!props.locked}
        />
        {props.locked && <AntDesign name="lock1" size={SIZES.icon.normal} />}
      </View>
      {props.error && (
        <View style={CommonStyles.errorContainer}>
          <Text style={CommonStyles.errorText}>{props.errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 10,
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  inputStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingLeft: 0,
    paddingTop: 0,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  errorText: {
    marginLeft: 10,
    color: '#d00',
  },
});

export function Seperator() {
  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        backgroundColor: Colors.$backgroundDisabled,
        height: 1,
        marginVertical: 10,
      }}
    />
  );
}

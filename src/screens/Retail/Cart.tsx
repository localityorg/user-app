import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {ScrollView, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';

import {useServices} from '../../services';
import {Button, CommonStyles, Header, Screen} from '../../components/Common/Elements';
import EditCart from '../../components/Retail/Order/EditCart';
import {BoldText, Text, View} from '../../components/Common/Themed';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import CreateOrderBottomModal from '../../components/Retail/Order/Create';
import {useSelector} from 'react-redux';
import {Colors} from 'react-native-ui-lib';
import {SIZES} from '../../utils/constants';

export default function Cart() {
  const {nav, t} = useServices();

  const checkoutSheet = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback(() => {}, []);

  const {cart} = useSelector((state: any) => state.cartReducer);

  return (
    <>
      <CreateOrderBottomModal
        bottomSheetModalRef={checkoutSheet}
        handleSheetChanges={handleSheetChanges}
      />
      <Screen>
        <Header title={t.do('screens.cart.title')} />
        {cart.length > 0 ? (
          <EditCart onPressBack={() => {}} />
        ) : (
          <View style={CommonStyles.loadingContainer}>
            <Text style={{color: Colors.$textDefault, fontSize: SIZES.font.text}}>
              Cart is empty at the moment.
            </Text>
            <TouchableOpacity
              onPress={() =>
                nav.push('SearchRetail', {
                  name: '',
                  category: '',
                })
              }
              style={{
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                backgroundColor: Colors.$backgroundNeutralMedium,
                marginTop: 10,
              }}
            >
              <BoldText style={{color: Colors.$textDefault, fontSize: SIZES.font.text}}>
                Search your favourite products
              </BoldText>
            </TouchableOpacity>
          </View>
        )}
        <View style={CommonStyles.actionBtnContainer}>
          {cart.length > 0 && (
            <Button
              label="Checkout"
              onPress={() => checkoutSheet.current?.present()}
              fullWidth={true}
            />
          )}
        </View>
      </Screen>
    </>
  );
}

import React from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CustomBackdrop, CustomBackground} from '../Retail/ModalStyle';
import {View} from './Themed';

interface ModalProps {
  content: any;
  sheetRef: any;
  snapPoints: any;
  onDismiss?: any;
}

export default function Modal(props: ModalProps) {
  return (
    <BottomSheetModal
      ref={props.sheetRef}
      snapPoints={props.snapPoints}
      style={{width: '100%', padding: '5%', paddingTop: 0}}
      backdropComponent={CustomBackdrop}
      backgroundComponent={CustomBackground}
      onDismiss={props.onDismiss}
    >
      <View style={{flex: 1, marginTop: '1%', backgroundColor: 'transparent'}}>
        {props.content}
      </View>
    </BottomSheetModal>
  );
}

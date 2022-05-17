import 'expo-dev-client';
import React, {useCallback, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {LogBox} from 'react-native';

import {AppNavigator} from './src/app';
import {configureDesignSystem} from './src/utils/designSystem';
import {StoresProvider, hydrateStores} from './src/stores';
import {initServices, ServicesProvider} from './src/services';

// handling auth
import {AuthProvider} from './src/redux/Common/reducers/auth';

// apollo
import {ApolloProvider} from '@apollo/client';
import {client} from './apollo/Provider';

// for modals
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

// redux
import {Provider} from 'react-redux';
import {Store} from './src/redux/store';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {LoadingContainer} from './src/components/Common/Elements';

LogBox.ignoreLogs(['Require']);

export default (): JSX.Element => {
  const [ready, setReady] = useState(false);

  const startApp = useCallback(async () => {
    await SplashScreen.preventAutoHideAsync();

    await hydrateStores();
    await initServices();
    configureDesignSystem();

    setReady(true);
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    startApp();
  }, [startApp]);

  if (!ready) {
    return <LoadingContainer />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ApolloProvider client={client}>
        <StoresProvider>
          <AuthProvider>
            <Provider store={Store}>
              <BottomSheetModalProvider>
                <ServicesProvider>
                  <AppNavigator />
                </ServicesProvider>
              </BottomSheetModalProvider>
            </Provider>
          </AuthProvider>
        </StoresProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
};

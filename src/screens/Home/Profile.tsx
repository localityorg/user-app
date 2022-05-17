import React, {useContext, useEffect} from 'react';
import {Alert} from 'react-native';

import {useServices} from '../../services';
import {Button, Header, Screen, Section} from '../../components/Common/Elements';
import {useDispatch, useSelector} from 'react-redux';
import {removeUser, setUser} from '../../redux/Common/actions';
import {setCart, setRunningAccounts} from '../../redux/Retail/actions';
import {View} from '../../components/Common/Themed';
import {AuthContext} from '../../redux/Common/reducers/auth';
import {useQuery} from '@apollo/client';
import {FETCH_RUNNINGACCOUNTS, GET_ACCOUNTS_UPDATE} from '../../graphql/Retail/account';

export default function Profile() {
  const {nav, t} = useServices();
  const dispatch: any = useDispatch();
  const context = useContext(AuthContext);

  const {accounts} = useSelector((state: any) => state.accountsReducer);
  const {user} = useSelector((state: any) => state.userReducer);

  function logout() {
    dispatch(setCart(null));
    dispatch(removeUser());
    context.logout();
  }

  const {
    loading: fetchingRunningAccounts,
    subscribeToMore,
    refetch,
  } = useQuery(FETCH_RUNNINGACCOUNTS, {
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      dispatch(setRunningAccounts(data.fetchRunningAccounts));
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_ACCOUNTS_UPDATE,
      variables: {contact: user.contact, storeId: ''},
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) return prev;
        const updatedQueryData = subscriptionData.data.accountsUpdate;
        const index = prev.fetchRunningAccounts.findIndex(
          (e: any) => e.store.id === updatedQueryData.store.id,
        );

        var updatedAccounts = [];

        if (index <= -1) {
          updatedAccounts = [updatedQueryData, ...prev.fetchRunningAccounts];
        } else {
          var prevAccounts = [...prev.fetchRunningAccounts];
          prevAccounts.splice(index, 1);
          updatedAccounts = [updatedQueryData, ...prevAccounts];
        }

        dispatch(setRunningAccounts(updatedAccounts));
        return Object.assign({}, prev, {
          fetchRunningAccounts: updatedAccounts,
        });
      },
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    refetch();
  }, [user]);

  return (
    <Screen>
      <Header
        title={t.do('screens.profile.title')}
        key={9340001231}
        icon="logout"
        onNext={() =>
          Alert.alert(
            'Logout Requested.',
            'If you wish to logout, press Logout below. To dismiss this action, press Cancel.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Logout',
                onPress: () => logout(),
                style: 'destructive',
              },
            ],
          )
        }
      />

      <Section
        title="Your Info"
        loading={fetchingRunningAccounts}
        body={
          <View style={{flexDirection: 'column'}}>
            <Button
              icon={true}
              label="Addresses"
              onPress={() => nav.push('Addresses')}
              fullWidth={true}
              name="pushpin"
            />
            {accounts && (
              <>
                <View style={{height: 10}} />
                <Button
                  icon={true}
                  label="Accounts"
                  onPress={() => nav.push('Accounts')}
                  fullWidth={true}
                  name="user"
                />
              </>
            )}
          </View>
        }
      />

      <Section
        title="Help"
        body={
          <View style={{flexDirection: 'column'}}>
            <Button
              icon={true}
              label="Information &amp; Privacy"
              onPress={() => nav.push('Profile')}
              fullWidth={true}
              name="info"
            />
            <View style={{height: 10}} />
            <Button
              icon={true}
              label="Contribute"
              onPress={() => nav.push('Profile')}
              fullWidth={true}
              name="sharealt"
            />
          </View>
        }
      />
    </Screen>
  );
}

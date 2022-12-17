import React, {useEffect, useMemo, useReducer} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {StyleSheet, StatusBar, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import * as keyChain from 'react-native-keychain';
import {Provider} from 'react-native-paper';
import theme from './src/themes';
import reducer, {ActionKind} from './src/reducer';
import {initialState} from './src/state';
import {Entreprise} from './src/types';
import {AuthContext} from './src/context/AuthContext';
import Onboarding from './src/navigation/Onboarding';
import AuthStack from './src/navigation/AuthScreen';
import AwesomeIcon from 'react-native-vector-icons/Feather';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authContext = useMemo(
    () => ({
      state,
      dispatch: {
        /**
         * dispatch an action to get user
         */
        getUser: (user: Entreprise) => {
          dispatch({
            type: ActionKind.FETCH_DETAILS,
            payload: user,
          });
        },
        /**
         * dispatch an action to sign out user
         */
        signOut: async () => {
          try {
            await keyChain.resetGenericPassword();
            dispatch({type: ActionKind.SIGN_OUT});
          } catch (error) {}
        },
      },
    }),
    [state],
  );

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider
      theme={{
        ...theme,
        version: 3,
      }}
      settings={{
        icon: props => <AwesomeIcon {...props} />,
      }}>
      <StatusBar
        backgroundColor={
          Platform.OS === 'ios' ? 'transparent' : theme.colors.primary
        }
        barStyle={Platform.OS === 'android' ? 'light-content' : 'default'}
        networkActivityIndicatorVisible={true}
      />
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <GestureHandlerRootView style={styles.wrapper}>
            {state?.isSignout ? <Onboarding /> : <AuthStack />}
          </GestureHandlerRootView>
        </NavigationContainer>
      </AuthContext.Provider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

export default App;

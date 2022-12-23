import React, {useEffect, useMemo, useReducer, useCallback} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {StyleSheet, StatusBar, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-native-paper';
import theme from './src/themes';
import reducer, {ActionKind} from './src/reducer';
import {initialState} from './src/state';
import {Entreprise} from './src/types';
import {AuthContext} from './src/context/AuthContext';
import Onboarding from './src/navigation/Onboarding';
import AuthStack from './src/navigation/AuthScreen';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserProfile} from './src/api';

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
            type: ActionKind.GET_USER,
            payload: user,
          });
        },
        /**
         * dispatch an action to sign out user
         */
        signOut: async () => {
          try {
            await Promise.all([
              AsyncStorage.removeItem('@soulkeeper_token'),
              AsyncStorage.removeItem('@soulkeeper_username'),
            ]);
            dispatch({type: ActionKind.SIGN_OUT});
          } catch (error) {}
        },
      },
    }),
    [state],
  );

  const loadAsync = useCallback(async () => {
    // Restore username and token from localStorage
    const [username, token] = await Promise.all([
      AsyncStorage.getItem('@soulkeeper_username'),
      AsyncStorage.getItem('@soulkeeper_token'),
    ]);
    if (username && token) {
      const userProfile = await getUserProfile(username, token);
      if (userProfile) {
        authContext?.dispatch?.getUser(userProfile);
        SplashScreen.hide();
      } else {
        SplashScreen.hide();
      }
    } else {
      authContext?.dispatch?.signOut();
      SplashScreen.hide();
    }
  }, [authContext?.dispatch]);

  useEffect(() => {
    // Get token localStorage and navigate to the authenticated screen
    loadAsync();
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
            {/* <AuthStack /> */}
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

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import theme from '../themes';

const Stack = createNativeStackNavigator();

const Onboarding = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{
          headerShown: false,
          headerBackTitle: 'Back',
          headerTintColor: theme.colors.text,
        }}
        component={Login}
      />
    </Stack.Navigator>
  );
};

export default Onboarding;

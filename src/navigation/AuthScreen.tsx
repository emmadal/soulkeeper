import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './TabBar';
import AddMember from '../screens/AddMember';
import Profile from '../screens/Profile';

import theme from '../themes';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabBar"
        component={TabBar}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddMember"
        component={AddMember}
        options={{
          title: 'Ajouter un membre',
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerTitleAlign: 'left',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Mon compte',
          headerTitleStyle: {
            color: theme.colors.text,
          },
          headerTitleAlign: 'left',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

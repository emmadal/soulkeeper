import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform} from 'react-native';
import {withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Pointage from '../screens/Pointage';


const Tab = createBottomTabNavigator();

const TabBar = ({theme}: any) => {
  const {colors} = theme;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          borderColor: 'transparent',
          backgroundColor: theme.colors.light,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerRight: () => null,
          headerLeft: () => null,
          headerTitle: () => null,
          headerShown: false,
          tabBarLabel: 'Accueil',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
            paddingBottom: Platform.OS === 'ios' ? 0 : 2,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name="home"
              size={22}
              color={focused ? colors.primary : colors.grey100}
            />
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grey100,
        }}
      />
      <Tab.Screen
        name="Pointage"
        component={Pointage}
        options={{
          title: 'Faire un pointage',
          headerTitleStyle: {
            color: colors.text,
          },
          headerTitleAlign: 'center',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
            paddingBottom: Platform.OS === 'ios' ? 0 : 2,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name="edit-3"
              size={22}
              color={focused ? colors.primary : colors.grey100}
            />
          ),
          tabBarLabel: 'Pointage',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grey100,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Mon profil',
          headerTitleStyle: {
            color: colors.text,
          },
          headerTitleAlign: 'center',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
            paddingBottom: Platform.OS === 'ios' ? 0 : 2,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name="users"
              size={22}
              color={focused ? colors.primary : colors.grey100}
            />
          ),
          tabBarLabel: 'Profil',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grey100,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Paramètres',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: colors.text,
          },
          tabBarLabel: 'Paramètres',
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: 'bold',
            paddingBottom: Platform.OS === 'ios' ? 0 : 2,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name="settings"
              size={22}
              color={focused ? colors.primary : colors.grey100}
            />
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grey100,
        }}
      />
    </Tab.Navigator>
  );
};

export default withTheme(TabBar);

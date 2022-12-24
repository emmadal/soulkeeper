import {MD3LightTheme as DefaultTheme} from 'react-native-paper';
import {DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';

const theme = {
  ...DefaultTheme,
  ...NavigationDefaultTheme,
  myOwnProperty: true,
  roundness: 1,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0752B6',
    success: '#4BB543',
    error: '#F44335',
    light: '#FFFFFF',
    clouds: '#ecf0f1',
    text: '#000000',
    grey100: '#00000084',
    snack: '#f15a22 ',
  },
};

export default theme;

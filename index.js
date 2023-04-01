/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import {registerTranslation} from 'react-native-paper-dates';
import App from './App';
import {name as appName} from './app.json';
registerTranslation('fr', {
  close: 'Fermer',
  save: 'Selectionner',
  selectSingle: 'Choisir la date',
  previous: 'Précedent',
  next: 'Suivant',
  pickDateFromCalendar: 'Choisissez la date du calendrier',
  typeInDate: 'Entrez la date',
});

AppRegistry.registerComponent(appName, () => App);

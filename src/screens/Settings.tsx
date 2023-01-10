import React, {useContext, useState} from 'react';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import theme from '../themes';
import {openComposer} from 'react-native-email-link';
import Loader from '../components/Loader';
import {AuthContext} from '../context/AuthContext';

const Settings = () => {
  const {dispatch} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const openMailBox = async () => {
    try {
      await openComposer({
        to: 'bigdataci@info.com',
      });
    } catch (error) {
      Alert.alert('Aucune application de messagerie disponible');
    }
  };

  const logOut = async () => {
    setLoading(!loading);
    setTimeout(async () => {
      setLoading(false);
      dispatch?.signOut();
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentScroll}>
        {/* <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => navigation.navigate('Manual')}>
          <Text variant="titleMedium" style={{color: theme.colors.text}}>
            Manuel d'utilisation
          </Text>
          <Icon color={theme.colors.text} name="chevron-right" size={20} />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.optionContainer} onPress={openMailBox}>
          <Text variant="titleMedium" style={{color: theme.colors.text}}>
            Contactez-nous
          </Text>
          <Icon color={theme.colors.text} name="mail" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={logOut}>
          <Text variant="titleMedium" style={{color: theme.colors.text}}>
            Déconnexion
          </Text>
          <Icon color={theme.colors.text} name="power" size={20} />
        </TouchableOpacity>
        <View style={styles.viewFooter}>
          <Text variant="titleMedium" style={styles.companyName}>
            BIGDATA CI SARL
          </Text>
          <Text variant="bodyLarge">
            Côte d'Ivoire, Abidjan, Yopougon Ananeraie
          </Text>
          <Text variant="bodyLarge">Tel: +225 05 94 02 90 83</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
  },
  contentScroll: {
    flexGrow: 1,
    padding: 20,
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 17,
    backgroundColor: theme.colors.light,
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  viewFooter: {
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  companyName: {
    fontWeight: '900',
  },
});
export default Settings;

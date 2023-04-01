import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import {Button, Dialog, Portal, TextInput} from 'react-native-paper';
import * as keyChain from 'react-native-keychain';
import theme from '../themes';
import {useNavigation} from '@react-navigation/native';
import {Avatar, Text} from 'react-native-paper';

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [isView, setIsView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const goToPage = async () => {
    try {
      setLoading(!loading);
      const res = await keyChain.getGenericPassword();
      setTimeout(() => {
        if (res) {
          if (res?.password === password) {
            setLoading(false);
            setVisible(false);
            setErr('');
            setIsView(false);
            setPassword('');
            navigation.navigate('Statistiques');
          } else {
            setLoading(false);
            setErr('Mot de passe incorrect');
          }
        }
      }, 2000);
    } catch (error) {
      setLoading(false);
    }
  };

  const onDismiss = () => {
    setVisible(false);
    setErr('');
    setIsView(false);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Soul Keeper', "Voulez vous quitter l'application?", [
        {
          text: 'Annuler',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'Quittez', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Portal>
        <Dialog
          style={styles.dialog}
          visible={visible}
          onDismiss={onDismiss}
          dismissable={true}>
          <Dialog.Title style={styles.dialogTitle}>
            Mot de passe pour continuer
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              secureTextEntry={isView}
              placeholderTextColor={theme.colors.grey100}
              autoCapitalize="none"
              style={styles.input}
              value={password}
              label="Mot de passe"
              onChangeText={text => setPassword(text)}
              right={
                <TextInput.Icon
                  icon={isView ? 'eye-off-outline' : 'eye-outline'}
                  iconColor={theme.colors.text}
                  onPress={() => setIsView(!isView)}
                />
              }
            />
            {err.length ? (
              <Text variant="labelLarge" style={styles.err}>
                {err}
              </Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="outlined"
              loading={loading}
              style={styles.btn}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.light}
              onPress={goToPage}>
              Continuer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <TouchableOpacity style={styles.block} onPress={() => setVisible(true)}>
        <Avatar.Image
          size={80}
          source={require('../assets/image/line-chart.gif')}
        />
        <Text style={styles.text} variant="bodyLarge">
          Consultez les Statistiques
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.block}
        onPress={() => navigation.navigate('ChooseCulte')}>
        <Avatar.Image size={80} source={require('../assets/image/book.gif')} />
        <Text style={styles.text} variant="bodyLarge">
          Marquez votre présence
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.light,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  dateView: {
    marginTop: 20,
  },
  inputStyle: {
    textAlign: 'auto',
  },
  block: {
    borderRadius: 10,
    borderColor: theme.colors.grey100,
    borderWidth: 3,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 1.7,
    marginVertical: 20,
    alignSelf: 'center',
  },
  input: {
    textAlign: 'auto',
    backgroundColor: theme.colors.light,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialog: {
    backgroundColor: theme.colors.light,
  },
  btn: {
    borderColor: theme.colors.primary,
  },
  err: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});

export default Home;

import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
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
      setLoading(true);
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
    } catch (error) {}
  };

  const onDismiss = () => {
    setVisible(false);
    setErr('');
    setIsView(false);
  };

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
              value={password}
              label="Mot de passe"
              onChangeText={text => setPassword(text)}
              right={
                <TextInput.Icon
                  icon={isView ? 'eye-slash' : 'eye'}
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
              style={styles.btn}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.light}
              onPress={goToPage}>
              {!loading ? (
                'Continuer'
              ) : (
                <ActivityIndicator
                  animating={loading}
                  color={theme.colors.light}
                />
              )}
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
        onPress={() => navigation.navigate('Pointage')}>
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
  text: {
    fontWeight: 'bold',
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
    borderColor: 'transparent',
  },
  err: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});

export default Home;

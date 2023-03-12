import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Text, useTheme, Button, TextInput} from 'react-native-paper';
import * as keyChain from 'react-native-keychain';
import {loginUser} from '../api';
import theme from '../themes';
import {AuthContext} from '../context/AuthContext';
import Loader from '../components/Loader';

const Login = () => {
  const [isView, setIsView] = useState(true);
  const [loading, setLoading] = useState(false);
  const {colors} = useTheme();
  const {dispatch} = useContext(AuthContext);

  const handleViewPassword = () => setIsView(!isView);

  const handleSignin = async (values: any) => {
    try {
      setLoading(!loading);
      const res = await loginUser(values.login, values.password);
      if (res?.login) {
        const {token, ...rest} = res;
        await keyChain.setGenericPassword(values.login, values.password);
        // update global state while dispatch action
        dispatch?.restoreToken(token);
        dispatch?.getUser(rest);
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert(res);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Erreur de connexion', error?.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Loader loading={loading} />
        <View style={styles.welcomeView}>
          <Text variant="titleLarge" style={styles.welcome}>
            Bienvienue sur SOUL KEEPER.
          </Text>
          <Text style={styles.welcomeSub} variant="titleMedium">
            L'application de suivi d'âmes!
          </Text>
          <Image
            style={styles.img}
            source={require('../assets/image/logo.png')}
          />
        </View>
        <Formik
          initialValues={{
            login: '',
            password: '',
          }}
          validationSchema={yup.object().shape({
            login: yup.string().required('Entrez votre login'),
            password: yup.string().required('Mot de passe requis'),
          })}
          onSubmit={values => handleSignin(values)}>
          {({
            handleChange,
            handleBlur,
            values,
            handleSubmit,
            touched,
            errors,
          }) => (
            <View style={styles.formView}>
              <Text variant="titleLarge" style={styles.appTitle}>
                Se connecter
              </Text>
              <View style={styles.Viewinput}>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  label="Nom d'utilisateur"
                  placeholder="Nom d'utilisateur"
                  placeholderTextColor={colors.grey100}
                  autoCapitalize="none"
                  value={values.login}
                  onChangeText={handleChange('login')}
                  onBlur={handleBlur('login')}
                  right={<TextInput.Icon icon="human" />}
                />
                {errors.login && touched.login && (
                  <Text style={[styles.error, {color: colors.error}]}>
                    {errors.login}
                  </Text>
                )}
              </View>
              <View style={styles.Viewinput}>
                <TextInput
                  mode="outlined"
                  secureTextEntry={isView}
                  style={styles.input}
                  placeholderTextColor={theme.colors.grey100}
                  autoCapitalize="none"
                  value={values.password}
                  label="Mot de passe"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  right={
                    <TextInput.Icon
                      icon={isView ? 'eye-off-outline' : 'eye-outline'}
                      iconColor={theme.colors.text}
                      onPress={handleViewPassword}
                    />
                  }
                />
                {errors.password && touched.password && (
                  <Text style={[styles.error, {color: colors.error}]}>
                    {errors.password}
                  </Text>
                )}
              </View>
              <Button
                onPress={handleSubmit}
                mode="outlined"
                style={styles.btn}
                buttonColor={colors.primary}
                textColor={theme.colors.light}>
                Connexion
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
    paddingTop: Platform.OS === 'ios' ? 66 : 30,
  },
  keyboard: {
    flex: 1,
  },
  welcomeView: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  welcome: {
    marginVertical: 5,
    fontWeight: '800',
  },
  welcomeSub: {
    marginVertical: 15,
    marginLeft: 2,
  },
  formView: {
    backgroundColor: theme.colors.light,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    height: Dimensions.get('window').height / 2.1,
    elevation: 2,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    padding: 10,
  },
  appTitle: {
    fontWeight: '600',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  btn: {
    width: Dimensions.get('window').width / 2,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: 20,
  },
  Viewinput: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  input: {
    textAlign: 'auto',
    backgroundColor: theme.colors.light,
  },
  img: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});

export default Login;

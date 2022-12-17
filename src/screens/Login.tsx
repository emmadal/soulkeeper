import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Text, useTheme, Button, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import * as keyChain from 'react-native-keychain';
import {getProfile, login, getCompanyById} from '../api';
import theme from '../themes';
import {AuthContext} from '../context/AuthContext';

const Login = () => {
  const [isView, setIsView] = useState(true);
  const [loading, setLoading] = useState(false);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {dispatch} = useContext(AuthContext);

  const handleViewPassword = () => setIsView(!isView);

  const handleSignin = async (values: any) => {
    setLoading(!loading);
    await keyChain.setGenericPassword(values.username, values.password);
    const req = await login(values.username, values.password);
    const {appToken, ...user} = req;

    if (appToken) {
      // Get user profile
      const res = await getProfile(appToken, req.id);

      // if user don't have any profile yet, redirect to profile screen creation
      if (!res) {
        setLoading(false);
        navigation.navigate('CreateProfile', {req});
      }

      // update global state while dispatch action
      if (res) {
        dispatch?.getUser(user);
        setLoading(false);
        if (user?.role === 'brand' || user?.type === 'brand') {
          const company = await getCompanyById(appToken, res?.companyId);
          dispatch?.updateCompany(company);
          dispatch?.updateProfile({appToken: appToken, ...res});
        } else {
          dispatch?.updateProfile({appToken: appToken, ...res});
        }
      }
    } else {
      setLoading(false);
      Alert.alert(req);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeView}>
        <Text variant="titleLarge" style={styles.welcome}>
          Welcome back.
        </Text>
        <Text variant="titleLarge" style={styles.welcome}>
          Glad to see you again!
        </Text>
        <Text variant="bodyLarge" style={styles.welcomeSub}>
          Let's go sign in.
        </Text>
      </View>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={yup.object().shape({
          username: yup.string().required('Please enter a valid username'),
          password: yup.string().required('Password required'),
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
              Login
            </Text>
            <View style={styles.input}>
              <TextInput
                mode="outlined"
                label="Username"
                placeholder="username"
                placeholderTextColor={colors.grey100}
                autoCapitalize="none"
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                right={<TextInput.Icon icon="user" />}
              />
              {errors.username && touched.username && (
                <Text style={[styles.error, {color: colors.error}]}>
                  {errors.username}
                </Text>
              )}
            </View>
            <View style={styles.input}>
              <TextInput
                mode="outlined"
                secureTextEntry={isView}
                placeholderTextColor={colors.grey100}
                autoCapitalize="none"
                value={values.password}
                label="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                right={
                  <TextInput.Icon
                    icon={isView ? 'eye-slash' : 'eye'}
                    iconColor={colors.dark}
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
              loading={loading}
              mode="outlined"
              style={styles.btn}
              buttonColor={colors.primary}
              labelStyle={styles.labelStyle}
              textColor={colors.light}>
              Sign in
            </Button>
            <TouchableOpacity
              style={styles.btnForgot}
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text
                variant="bodyLarge"
                style={[styles.textForgot, {color: colors.error}]}>
                {' '}
                Forgot password ?
              </Text>
            </TouchableOpacity>
            <View style={styles.ViewSignup}>
              <Text variant="bodyLarge">New here ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text variant="bodyLarge" style={styles.signup}>
                  {' '}
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
    paddingTop: Platform.OS === 'ios' ? 66 : 20,
  },
  welcomeView: {
    marginHorizontal: 20,
    marginTop: 40,
  },
  welcome: {
    marginVertical: 5,
    fontWeight: '800',
    fontFamily: 'Poppins-Bold',
  },
  welcomeSub: {
    marginVertical: 15,
    marginLeft: 2,
    fontFamily: 'Poppins-Regular',
  },
  formView: {
    backgroundColor: theme.colors.light,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    height: Dimensions.get('window').height / 1.89,
    elevation: 2,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    padding: 10,
  },
  appTitle: {
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  btn: {
    width: Dimensions.get('window').width / 2,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: 20,
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 5,
    textAlign: 'auto',
  },
  textForgot: {
    marginTop: 25,
    marginHorizontal: 20,
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
  btnForgot: {
    alignSelf: 'flex-start',
    fontFamily: 'Poppins-Regular',
  },
  ViewSignup: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  labelStyle: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  signup: {
    color: theme.colors.primary,
    fontFamily: 'Poppins-Bold',
    fontWeight: '500',
  },
});

export default Login;

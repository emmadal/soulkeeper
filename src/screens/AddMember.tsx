import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {TextInput, Button, Text} from 'react-native-paper';
import theme from '../themes';
import {PaperSelect} from 'react-native-paper-select';
import Loader from '../components/Loader';
import * as regex from '../regex';
import {getCities, getCommune, getCountry, addMember} from '../api';
import {AuthContext} from '../context/AuthContext';
import useRefreshToken from '../hooks/useRefreshToken';
import {useNavigation} from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';

const AddMember = () => {
  const [loading, setLoading] = useState(false);
  const {state} = useContext(AuthContext);
  const token = useRefreshToken();
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);

  const [country, setCountry] = useState<any>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });
  const [town, setTown] = useState<any>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });
  const [commune, setCommune] = useState<any>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });

  // Get Cities and district from database
  const retrieveDataFromServer = useCallback(async () => {
    const communeArr = [];
    const cityArr = [];
    const countryArr = [];

    const [cities, districts, countries] = await Promise.all([
      getCities(token || state?.token, state?.user?.identreprises),
      getCommune(token || state?.token, state?.user?.identreprises),
      getCountry(token || state?.token),
    ]);

    // format data to be conform with paperSelect dataTypes
    for (const district of districts) {
      communeArr.push({_id: district?.idcommune, value: district?.libelle});
    }
    for (const city of cities) {
      cityArr.push({_id: city?.idville, value: city?.libelle});
    }

    for (const pays of countries) {
      countryArr.push({_id: pays?.idpays, value: pays?.nom_fr_fr});
    }

    // update state
    setCommune({...commune, list: [...communeArr]});
    setTown({...town, list: [...cityArr]});
    setCountry({...country, list: [...countryArr]});
  }, [commune, country, state?.token, state?.user?.identreprises, token, town]);

  useEffect(() => {
    retrieveDataFromServer();
  }, []);

  const getDate = () => {
    const date = new Date().toLocaleDateString('fr');
    const splitDate = date?.split('/').reverse().join('-');
    return splitDate;
  };

  const saveMember = async (values: any) => {
    setLoading(!loading);
    const {jour, mois, annee, ...rest} = values;
    const data = {
      ...rest,
      date_naissance: annee ? `${jour}-${mois}-${annee}` : `${jour}-${mois}`,
      idpays: country?.selectedList[0]?._id,
      idcommune: commune?.selectedList[0]?._id,
      idville: town?.selectedList[0]?._id,
      dateenregistre: getDate(),
      identreprises: state?.user?.identreprises,
      contact: formattedValue,
    };
    const req = await addMember(data, token || state?.token);
    if (req?.status) {
      setLoading(false);
      Alert.alert(
        'Ajout de membre',
        `${req?.message}`,
        [
          {
            text: 'OK',
            style: 'default',
            onPress: () => navigation.goBack(),
          },
        ],
        {cancelable: false},
      );
    } else {
      setLoading(false);
      Alert.alert(req?.message);
    }
  };

  useEffect(() => {
    const checkValid = phoneInput.current?.isValidNumber(value);
    setValid(checkValid ? checkValid : false);
  }, [value]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Loader loading={loading} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scroll}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              nom: '',
              prenoms: '',
              jour: '',
              mois: '',
              annee: '',
              autre_contact: '',
              email: '',
              quartier: '',
            }}
            validationSchema={yup.object().shape({
              nom: yup.string().required('Entrez votre Nom'),
              prenoms: yup.string().required('Entrez votre Prénoms'),
              mois: yup
                .string()
                .matches(regex.month, 'Mois (01-12)')
                .required('Mois de naissance'),
              jour: yup
                .string()
                .matches(regex.day, 'Jour (01-31)')
                .required('Jour de naissance'),
              annee: yup.string().matches(regex.year, 'Année (1950-2050)'),
              quartier: yup
                .string()
                .required("Entrez votre quartier d'habitation"),
            })}
            onSubmit={values => saveMember(values)}>
            {({
              handleBlur,
              handleChange,
              values,
              handleSubmit,
              errors,
              touched,
            }) => (
              <View style={styles.content}>
                <View style={styles.row}>
                  <View style={styles.inputWrap}>
                    <TextInput
                      mode="outlined"
                      label="Nom"
                      autoCapitalize="none"
                      value={values.nom}
                      onChangeText={handleChange('nom')}
                      style={styles.inputView}
                      onBlur={handleBlur('nom')}
                    />
                    {errors.nom && touched.nom && (
                      <Text style={{color: theme.colors.error}}>
                        {errors.nom}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputWrap}>
                    <TextInput
                      mode="outlined"
                      label="Prénoms"
                      autoCapitalize="none"
                      value={values.prenoms}
                      onChangeText={handleChange('prenoms')}
                      style={styles.inputView}
                      onBlur={handleBlur('prenoms')}
                    />
                    {errors.prenoms && touched.prenoms && (
                      <Text style={{color: theme.colors.error}}>
                        {errors.prenoms}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputWrap}>
                    <TextInput
                      mode="outlined"
                      label="Jour"
                      keyboardType="decimal-pad"
                      autoCapitalize="none"
                      value={values.jour}
                      onChangeText={handleChange('jour')}
                      style={styles.inputView}
                      onBlur={handleBlur('jour')}
                    />
                    {errors.jour && touched.jour && (
                      <Text style={{color: theme.colors.error}}>
                        {errors.jour}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputWrap}>
                    <TextInput
                      mode="outlined"
                      label="Mois"
                      keyboardType="decimal-pad"
                      autoCapitalize="none"
                      value={values.mois}
                      onChangeText={handleChange('mois')}
                      style={styles.inputView}
                      onBlur={handleBlur('mois')}
                    />
                    {errors.mois && touched.mois && (
                      <Text style={{color: theme.colors.error}}>
                        {errors.mois}
                      </Text>
                    )}
                  </View>
                  <View style={styles.inputWrap}>
                    <TextInput
                      mode="outlined"
                      label="Année (Facultatif)"
                      autoCapitalize="none"
                      value={values.annee}
                      keyboardType="decimal-pad"
                      onChangeText={handleChange('annee')}
                      style={styles.inputView}
                      onBlur={handleBlur('annee')}
                    />
                    {errors.annee && touched.annee && (
                      <Text style={{color: theme.colors.error}}>
                        {errors.annee}
                      </Text>
                    )}
                  </View>
                </View>
                <View>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    placeholder="Entrez votre Contact"
                    defaultCode={'CI'}
                    layout="first"
                    containerStyle={styles.phoneContainerStyle}
                    onChangeText={text => setValue(text)}
                    onChangeFormattedText={text => setFormattedValue(text)}
                    textContainerStyle={styles.textContainerStyle}
                  />
                </View>
                {!valid && value.length ? (
                  <Text style={{color: theme.colors.error}}>
                    Entrez un contact valide suivi du code indicatif
                  </Text>
                ) : null}
                <TextInput
                  mode="outlined"
                  label="Autre contact (Facultatif)"
                  keyboardType="phone-pad"
                  placeholder="xxx xxx xxx"
                  autoCapitalize="none"
                  value={values.autre_contact}
                  onChangeText={handleChange('autre_contact')}
                  style={styles.inputView}
                  onBlur={handleBlur('autre_contact')}
                />
                <TextInput
                  mode="outlined"
                  label="Email (Facultatif)"
                  keyboardType="email-address"
                  placeholder="Email"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  style={styles.inputView}
                  onBlur={handleBlur('email')}
                />
                <PaperSelect
                  label="Pays (Facultatif)"
                  value={country.selectedList[0]?.value}
                  onSelection={(value: any) => {
                    setCountry({
                      ...country,
                      value: value.text,
                      selectedList: value.selectedList,
                      error: '',
                    });
                  }}
                  checkboxLabelStyle={{color: theme.colors.text}}
                  searchPlaceholder="Recherche"
                  textInputStyle={styles.select}
                  dialogTitle="Sélectionnez un pays"
                  activeUnderlineColor="transparent"
                  underlineColor="transparent"
                  textInputMode="outlined"
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  hideSearchBox={false}
                  multiEnable={false}
                  arrayList={[...country.list]}
                  selectedArrayList={[...country.selectedList]}
                  errorText={country.error}
                  checkboxColor={theme.colors.primary}
                  modalCloseButtonText="Fermer"
                  modalDoneButtonText="Choisir"
                />
                <PaperSelect
                  label="Ville (Facultatif)"
                  value={town.value}
                  onSelection={(value: any) => {
                    setTown({
                      ...town,
                      value: value.text,
                      selectedList: value.selectedList,
                      error: '',
                    });
                  }}
                  checkboxLabelStyle={{color: theme.colors.text}}
                  searchPlaceholder="Recherche"
                  textInputStyle={styles.select}
                  activeUnderlineColor="transparent"
                  underlineColor="transparent"
                  textInputMode="outlined"
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  hideSearchBox={true}
                  multiEnable={false}
                  arrayList={[...town.list]}
                  selectedArrayList={[...town.selectedList]}
                  errorText={town.error}
                  checkboxColor={theme.colors.primary}
                  modalCloseButtonText="Fermer"
                  modalDoneButtonText="Choisir"
                />

                <PaperSelect
                  label="Commune (Facultatif)"
                  value={commune.value}
                  onSelection={(value: any) => {
                    setCommune({
                      ...commune,
                      value: value.text,
                      selectedList: value.selectedList,
                      error: '',
                    });
                  }}
                  checkboxLabelStyle={{color: theme.colors.text}}
                  searchPlaceholder="Recherche"
                  textInputStyle={styles.select}
                  activeUnderlineColor="transparent"
                  underlineColor="transparent"
                  textInputMode="outlined"
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  hideSearchBox={true}
                  multiEnable={false}
                  arrayList={[...commune.list]}
                  selectedArrayList={[...commune.selectedList]}
                  errorText={commune.error}
                  checkboxColor={theme.colors.primary}
                  modalCloseButtonText="Fermer"
                  modalDoneButtonText="Choisir"
                />
                <View>
                  <TextInput
                    mode="outlined"
                    label="Quartier"
                    placeholder="Quartier"
                    autoCapitalize="none"
                    value={values.quartier}
                    onChangeText={handleChange('quartier')}
                    style={styles.inputView}
                    onBlur={handleBlur('quartier')}
                  />
                  {errors.quartier && touched.quartier && (
                    <Text style={{color: theme.colors.error}}>
                      {errors.quartier}
                    </Text>
                  )}
                </View>

                <Button
                  onPress={handleSubmit}
                  mode="outlined"
                  style={styles.btnSave}
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.light}>
                  Valider l'inscription
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
  },
  keyboard: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  inputWrap: {
    flex: 1,
    marginHorizontal: 2,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  phoneContainerStyle: {
    borderColor: theme.colors.outline,
    borderWidth: 1,
    width: '100%',
    paddingVertical: 0,
    marginVertical: 8,
    backgroundColor: theme.colors.light,
  },
  textContainerStyle: {
    backgroundColor: theme.colors.light,
    paddingVertical: 0,
  },
  inputView: {
    textAlign: 'auto',
    marginVertical: 8,
    width: 'auto',
    backgroundColor: theme.colors.light,
  },
  desc: {
    marginVertical: 10,
  },
  error: {},
  btnSave: {
    alignSelf: 'center',
    borderColor: 'transparent',
    marginVertical: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  Textsocial: {
    fontWeight: '400',
  },
  textsocialUsername: {
    fontWeight: '400',
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snack: {
    backgroundColor: theme.colors.snack,
    color: theme.colors.light,
  },
  select: {
    marginTop: 9,
    textAlign: 'auto',
  },
  affix: {
    color: theme.colors.text,
  },
});

export default AddMember;

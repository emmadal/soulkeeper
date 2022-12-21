import React, {useState, useEffect, useMemo} from 'react';
import {ScrollView, View, StyleSheet, SafeAreaView} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {TextInput, Button, Text, Snackbar} from 'react-native-paper';
import theme from '../themes';
import {useNavigation} from '@react-navigation/native';
import {PaperSelect} from 'react-native-paper-select';
import Loader from '../components/Loader';
import * as regex from '../regex';
import {countryList} from '../utils';

const AddMember = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, SetMessage] = useState('');
  const navigation = useNavigation();
  const [country, setCountry] = useState<any>({
    value: '',
    list: [...countryList],
    selectedList: [],
    error: '',
  });
  const [gender, setGender] = useState<any>({
    value: '',
    list: [
      {_id: '1', value: 'MALE'},
      {_id: '2', value: 'FEMALE'},
      {_id: '3', value: 'OTHERS'},
    ],
    selectedList: [],
    error: '',
  });

  const onDismissSnackBar = () => setVisible(false);

  const saveMember = async (values: any) => {
    console.log(values);
  };

  const dateIsValid = (dateStr: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (dateStr.match(regex) === null) {
      return false;
    }

    const [day, month, year] = dateStr.split('/');

    // 👇️ format Date string as `yyyy-mm-dd`
    const isoFormattedStr = `${year}-${month}-${day}`;

    const date = new Date(isoFormattedStr);

    const timestamp = date.getTime();

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }

    return date.toISOString().startsWith(isoFormattedStr);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            datenaissance: '',
            contact: '',
            autre_contact: '',
            idprofession: '',
            email: '',
            quartier: '',
            idtribu: '',
            idstatut: '',
            genre: '',
            identreprises: '',
          }}
          validate={values => {
            const errors = {};
            if (!dateIsValid(values.datenaissance)) {
              errors.datenaissance = 'Entrez une date de naissance valide';
            }
            return errors;
          }}
          validationSchema={yup.object().shape({
            nom: yup.string().required('Entrez votre Nom'),
            prenoms: yup.string().required('Entrez votre Prénoms'),
            contact: yup
              .string()
              .matches(regex.phoneNumber, 'Entrez un contact valide')
              .required('Entrez un contact valide'),
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
              <View>
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
                  <Text style={{color: theme.colors.error}}>{errors.nom}</Text>
                )}
              </View>
              <View>
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
              <View>
                <TextInput
                  mode="outlined"
                  label="Date de naissance (DD/MM/YYYY)"
                  autoCapitalize="none"
                  value={values.datenaissance}
                  onChangeText={handleChange('datenaissance')}
                  style={styles.inputView}
                  onBlur={handleBlur('datenaissance')}
                />
                {errors.datenaissance && touched.datenaissance && (
                  <Text style={{color: theme.colors.error}}>
                    {errors.datenaissance}
                  </Text>
                )}
              </View>
              <View>
                <TextInput
                  mode="outlined"
                  label="Contact"
                  keyboardType="phone-pad"
                  placeholder="+225 xxx xxx xxx"
                  autoCapitalize="none"
                  value={values.contact}
                  onChangeText={handleChange('contact')}
                  style={styles.inputView}
                  onBlur={handleBlur('contact')}
                />
                {errors.contact && touched.contact && (
                  <Text style={{color: theme.colors.error}}>
                    {errors.contact}
                  </Text>
                )}
              </View>
              <TextInput
                mode="outlined"
                label="Autre contact (Facultatif)"
                keyboardType="phone-pad"
                placeholder="+225 xxx xxx xxx"
                autoCapitalize="none"
                value={values.autre_contact}
                onChangeText={handleChange('autre_contact')}
                style={styles.inputView}
                onBlur={handleBlur('autre_contact')}
              />
              <PaperSelect
                label="Pays"
                value={country.selectedList[0]?.value}
                onSelection={(value: any) => {
                  setCountry({
                    ...country,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: '',
                  });
                }}
                dialogTitle="Sélectionnez un pays"
                activeUnderlineColor="transparent"
                underlineColor="transparent"
                textInputMode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                hideSearchBox={true}
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
                value={gender.value}
                onSelection={(value: any) => {
                  setGender({
                    ...gender,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: '',
                  });
                }}
                activeUnderlineColor="transparent"
                underlineColor="transparent"
                textInputMode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                hideSearchBox={true}
                multiEnable={false}
                arrayList={[...gender.list]}
                selectedArrayList={[...gender.selectedList]}
                errorText={gender.error}
                checkboxColor={theme.colors.primary}
              />

              <PaperSelect
                label="Commune (Facultatif)"
                value={gender.value}
                onSelection={(value: any) => {
                  setGender({
                    ...gender,
                    value: value.text,
                    selectedList: value.selectedList,
                    error: '',
                  });
                }}
                activeUnderlineColor="transparent"
                underlineColor="transparent"
                textInputMode="outlined"
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                hideSearchBox={true}
                multiEnable={false}
                arrayList={[...gender.list]}
                selectedArrayList={[...gender.selectedList]}
                errorText={gender.error}
                checkboxColor={theme.colors.primary}
              />
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
              {/* <DatePickerInput
                locale="fr"
                label="Date de naissance"
                activeOutlineColor={theme.colors.primary}
                outlineColor={theme.colors.outline}
                value={inputDate}
                saveLabel="Choisir"
                onChange={d => setInputDate(d)}
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                inputMode="start"
                style={styles.dateInput}
                mode="outlined"
                calendarIcon="calendar"
              /> */}
              <Button
                onPress={handleSubmit}
                mode="outlined"
                style={styles.btnSave}
                buttonColor={theme.colors.primary}
                labelStyle={styles.labelStyle}
                textColor={theme.colors.light}>
                Ajouter un membre
              </Button>
            </View>
          )}
        </Formik>
        <Snackbar
          duration={3000}
          action={{
            label: 'Close',
            onPress: () => onDismissSnackBar(),
            labelStyle: {color: theme.colors.light},
          }}
          style={styles.snack}
          visible={visible}
          onDismiss={onDismissSnackBar}>
          <Text style={{color: theme.colors.light}}>{message}</Text>
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
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
    padding: 20,
  },
  inputView: {
    textAlign: 'auto',
    marginVertical: 8,
    width: 'auto',
    color: '#000',
  },
  desc: {
    marginVertical: 10,
  },
  error: {},
  btnSave: {
    alignSelf: 'center',
    borderColor: 'transparent',
    margin: 15,
  },
  labelStyle: {},
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
  dateInput: {
    // marginTop: -150,
  },
});

export default AddMember;

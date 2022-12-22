import React, {useContext, useState} from 'react';
import {StyleSheet, View, Platform, ScrollView} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {FAB} from 'react-native-paper';
import {PaperSelect} from 'react-native-paper-select';
import {DatePickerInput} from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../themes';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const {state} = useContext(AuthContext);
  const [inputDate, setInputDate] = React.useState<Date | undefined>(undefined);
  const navigation = useNavigation();
  const [gender, setGender] = useState<any>({
    value: '',
    list: [
      {_id: '1', value: 'Culte du dimanche'},
      {_id: '2', value: 'Cellule de priere'},
      {_id: '3', value: "Culte d'enseignement"},
    ],
    selectedList: [],
    error: '',
  });

  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <View style={styles.dateView}>
          <PaperSelect
            label="Sélectionnez un culte"
            value={gender.value}
            onSelection={(value: any) => {
              setGender({
                ...gender,
                value: value.text,
                selectedList: value.selectedList,
                error: '',
              });
            }}
            dialogTitle="Sélectionnez un culte"
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
            modalCloseButtonText="Fermer"
            modalDoneButtonText="Choisir"
          />
        </View>
        <View style={styles.dateView}>
          <DatePickerInput
            locale="fr"
            label="Selectionnez un date"
            activeOutlineColor={theme.colors.primary}
            outlineColor={theme.colors.outline}
            value={inputDate}
            saveLabel="Choisir"
            onChange={d => setInputDate(d)}
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            inputMode="start"
            mode="outlined"
            calendarIcon="calendar"
          />
        </View>
        <FAB
          icon={() => (
            <Icon name="user-plus" color={theme.colors.light} size={24} />
          )}
          mode="flat"
          size="medium"
          color={theme.colors.light}
          style={[styles.fab, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('AddMember')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: 15,
  },
  content: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    margin: 40,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  dateView: {
    marginTop: 20,
  },
});

export default Home;

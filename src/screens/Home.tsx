import React, {useCallback, useContext, useEffect, useState} from 'react';
import {StyleSheet, View, Platform, ScrollView} from 'react-native';
import {FAB} from 'react-native-paper';
import {PaperSelect} from 'react-native-paper-select';
import {DatePickerInput} from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../themes';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {getCultes, getStatistiques} from '../api';
import useRefreshToken from '../hooks/useRefreshToken';
import ChartLegend from '../components/ChartLegend';

const Home = () => {
  const [inputDate, setInputDate] = React.useState<Date | undefined>(undefined);
  const navigation = useNavigation();
  const {state} = useContext(AuthContext);
  const [dataCharts, setDataCharts] = useState<any>([]);
  const token = useRefreshToken();

  const [cultes, setCultes] = useState<any>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });

  const handleCulte = useCallback(async () => {
    try {
      const arr = [];
      const res = await getCultes(token || state.token);
      if (res?.length) {
        for (const cult of res) {
          arr.push({_id: cult?.idculte, value: cult?.libelle});
        }
        setCultes({...cultes, list: [...arr]});
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [cultes, state?.token, token]);

  const getDate = (item: any) => {
    const req = new Date(item).toLocaleDateString('fr');
    const splitDate = req?.split('/').reverse().join('-');
    return splitDate;
  };

  const fetchStats = useCallback(
    async (d: any) => {
      try {
        const idculte = cultes.selectedList[0]?._id;
        const rDate = getDate(d);
        const data = {
          date: rDate,
          idculte,
          identreprises: state?.user?.identreprises,
        };
        const res = await getStatistiques(token || state?.token, data);
        setDataCharts(res);
      } catch (error) {
        console.log('Stats Error: ', error?.message);
      }
    },
    [cultes.selectedList, state?.token, state?.user?.identreprises, token],
  );

  useEffect(() => {
    handleCulte();
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}>
        <View style={styles.dateView}>
          <PaperSelect
            label="Sélectionnez un culte"
            value={cultes.value}
            onSelection={(value: any) => {
              setCultes({
                ...cultes,
                value: value.text,
                selectedList: value.selectedList,
                error: '',
              });
            }}
            checkboxLabelStyle={{color: theme.colors.text}}
            searchPlaceholder="Recherche"
            dialogTitle="Sélectionnez un culte"
            textInputStyle={styles.inputStyle}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            textInputMode="outlined"
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            hideSearchBox={false}
            multiEnable={false}
            arrayList={[...cultes.list]}
            selectedArrayList={[...cultes.selectedList]}
            errorText={cultes.error}
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
            onChange={async d => {
              setInputDate(d);
              if (cultes?.selectedList?.length) {
                await fetchStats(d);
              }
            }}
            underlineColor="transparent"
            underlineColorAndroid="transparent"
            inputMode="start"
            mode="outlined"
            calendarIcon="calendar"
          />
        </View>
        {dataCharts.total && cultes.selectedList.length ? (
          <ChartLegend dataCharts={dataCharts} />
        ) : null}
        <FAB
          icon={() => (
            <Icon name="user-plus" color={theme.colors.light} size={24} />
          )}
          mode="flat"
          size="medium"
          color={theme.colors.light}
          style={[styles.fab, {backgroundColor: theme.colors.primary}]}
          onPress={() => {
            navigation.navigate('AddMember');
          }}
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
    margin: 20,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  dateView: {
    marginTop: 20,
  },
  inputStyle: {
    textAlign: 'auto',
  },
});

export default Home;

import React, {useContext, useState, useEffect, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {PaperSelect} from 'react-native-paper-select';
import {Text} from 'react-native-paper';
import {DatePickerInput} from 'react-native-paper-dates';
import theme from '../themes';
import {AuthContext} from '../context/AuthContext';
import useRefreshToken from '../hooks/useRefreshToken';
import {getCultes, getStatistiques} from '../api';
import ChartLegend from '../components/ChartLegend';

const Statistiques = () => {
  const {state} = useContext(AuthContext);
  const [inputDate, setInputDate] = React.useState<Date | undefined>(undefined);
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
      const res = await getCultes(
        token || state.token,
        state?.user?.identreprises,
      );
      if (res?.length) {
        for (const cult of res) {
          arr.push({_id: cult?.idculte, value: cult?.libelle});
        }
        setCultes({...cultes, list: [...arr]});
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [cultes, state.token, state.user?.identreprises, token]);

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
    <View style={styles.container}>
      <View style={styles.dateView}>
        <Text variant="titleMedium" style={styles.title}>
          Pour afficher les Statistiques, Veuillez choisir une Date et un Culte
        </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
  },
  dateView: {
    marginTop: 20,
  },
  inputStyle: {
    textAlign: 'auto',
  },
});

export default Statistiques;

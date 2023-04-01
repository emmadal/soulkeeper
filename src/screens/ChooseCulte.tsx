import React, {useContext, useState} from 'react';
import {Button, Text} from 'react-native-paper';
import {StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {PaperSelect} from 'react-native-paper-select';
import {getCultes} from '../api';
import theme from '../themes';
import useRefreshToken from '../hooks/useRefreshToken';
import {AuthContext} from '../context/AuthContext';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const ChooseCulte = () => {
  const token = useRefreshToken();
  const {state} = useContext(AuthContext);
  const navigation = useNavigation();
  const [cultes, setCultes] = useState<any>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      try {
        const handleCulte = async () => {
          const arr = [];
          const res = await getCultes(
            token || state.token,
            state.user.identreprises,
          );
          if (res?.length) {
            for (const cult of res) {
              arr.push({_id: cult?.idculte, value: cult?.libelle});
            }
            if (isActive) {
              setCultes({...cultes, list: [...arr]});
            }
          }
        };

        handleCulte();

        return () => {
          isActive = false;
        };
      } catch (error) {}
    }, [cultes, state.token, token]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Pour marquer votre présence, Veuillez Choisir le culte et continuez
      </Text>
      <PaperSelect
        label="Sélectionnez un évenement"
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
        activeUnderlineColor="transparent"
        underlineColor="transparent"
        textInputMode="outlined"
        textInputStyle={styles.textInputStyle}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        hideSearchBox={false}
        multiEnable={false}
        searchPlaceholder="Recherche"
        dialogTitleStyle={styles.dialogTitle}
        arrayList={[...cultes.list]}
        selectedArrayList={[...cultes.selectedList]}
        errorText={cultes.error}
        checkboxColor={theme.colors.primary}
        modalCloseButtonText="Fermer"
        modalDoneButtonText="Choisir"
      />
      {cultes.selectedList.length ? (
        <Button
          onPress={() =>
            navigation.navigate('Pointage', {
              idculte: cultes?.selectedList[0]?._id,
            })
          }
          mode="outlined"
          style={styles.btn}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.light}>
          Suivant
        </Button>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
  },
  viewSelect: {
    flex: 1,
  },
  contentScroll: {
    flexGrow: 1,
  },
  dialogTitle: {
    fontSize: 18,
  },
  textInputStyle: {
    textAlign: 'auto',
    margin: 15,
  },
  renderItem: {
    margin: 10,
    backgroundColor: theme.colors.background,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    marginHorizontal: 30,
    fontWeight: 'bold',
  },
  searchBar: {
    marginTop: 5,
    marginHorizontal: 23,
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 15,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  snack: {
    backgroundColor: theme.colors.success,
  },
  btn: {
    width: Dimensions.get('window').width / 2,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: 15,
  },
});
export default ChooseCulte;

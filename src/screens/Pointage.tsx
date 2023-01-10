import React, {
  useEffect,
  useCallback,
  useContext,
  useState,
  useRef,
  memo,
} from 'react';
import {Text, Searchbar, Snackbar, Button} from 'react-native-paper';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {PaperSelect} from 'react-native-paper-select';
import {getCultes, getMembers, addPointage} from '../api';
import theme from '../themes';
import useRefreshToken from '../hooks/useRefreshToken';
import {AuthContext} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import {Membres, Pointage as PointageTypes} from '../types';
import Loader from '../components/Loader';
import ListFooter from '../components/ListFooter';
import {useNavigation} from '@react-navigation/native';

const size = 50;
// const arrPointage: PointageTypes[] = [];

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Pointage = () => {
  const token = useRefreshToken();
  const {state} = useContext(AuthContext);
  const page = useRef(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Membres[]>([]);
  const [pointageList, setPointageList] = useState<PointageTypes | null>();
  const [refreshing, setRefreshing] = useState(false);
  const [message, SetMessage] = useState('');
  const [cultes, setCultes] = useState<any>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });
  const navigation = useNavigation();

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const handleCulte = useCallback(async () => {
    const arr = [];
    const res = await getCultes(token || state.token);
    if (res?.length) {
      for (const cult of res) {
        arr.push({_id: cult?.idculte, value: cult?.libelle});
      }
      setCultes({...cultes, list: [...arr]});
    }
  }, [cultes, state.token, token]);

  const fetchMembers = useCallback(async () => {
    const req = await getMembers(token || state?.token, size, page.current);
    setMembers([...members, ...req?.membres]);
    return req;
  }, [members, state?.token, token]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const req = await getMembers(token || state?.token, size, 0);
      if (req) {
        wait(2000).then(() => {
          setRefreshing(false);
          setMembers(req?.membres);
        });
      } else {
        setRefreshing(false);
      }
    } catch (error) {
      setRefreshing(false);
      Alert.alert(error);
    }
  }, [state?.token, token]);

  useEffect(() => {
    handleCulte();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, []);

  const getDate = () => {
    const date = new Date().toLocaleDateString('fr');
    const splitDate = date?.split('/').reverse().join('-');
    return splitDate;
  };

  const fetchMoreData = async () => {
    setLoadingMore(true);
    page.current += 1;
    const response = await fetchMembers();
    if (!response?.membres?.length) {
      setLoadingMore(false);
      return;
    } else {
      setMembers([...members, ...response?.membres]);
    }
    setLoadingMore(false);
  };

  const returnData = () => {
    if (searchQuery.length) {
      const filterData = members.filter(
        i =>
          i.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.prenoms.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return filterData;
    }
    return members;
  };

  // const handlePointage = (idmembres: number) => {
  //   const isExist = arrPointage.some(i => i.idmembres === idmembres);
  //   if (!isExist) {
  //     const data = {
  //       date: getDate(),
  //       idmembres,
  //       idculte: cultes?.selectedList[0]?._id,
  //       identreprises: state.user.identreprises ?? 0,
  //     };
  //     arrPointage.push(data);
  //     setPointageList([...pointageList, ...arrPointage]);
  //   } else {
  //     const dataIndex = arrPointage.findIndex(i => i.idmembres === idmembres);
  //     arrPointage.splice(dataIndex, 1);
  //     setPointageList([...arrPointage]);
  //   }
  // };

  const renderIcon = (idmembres: number | undefined) => {
    if (idmembres === pointageList?.idmembres) {
      return (
        <Icon name="check-circle" color={theme.colors.success} size={20} />
      );
    } else {
      return <Icon name="circle" color={theme.colors.text} size={20} />;
    }
  };

  const onDismissSnackBar = () => setVisible(false);

  const sendPointage = (pointage: any) => {
    setPointageList(pointage);
    Alert.alert(
      'Pointage',
      'Confirmation du pointage',
      [
        {
          text: 'Annuler',
          style: 'cancel',
          onPress: () => setPointageList(null),
        },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: async () => {
            const data = {
              date: getDate(),
              idmembres: pointage?.idmembres,
              idculte: cultes?.selectedList[0]?._id,
              identreprises: state.user.identreprises ?? 0,
            };
            setLoading(!loading);
            const req = await addPointage(data, token || state?.token);
            if (req?.status === 200) {
              setLoading(false);
              setVisible(!visible);
              SetMessage(req?.message);
              setPointageList(null);
            } else {
              setLoading(false);
              setVisible(false);
              setPointageList(null);
              Alert.alert(req?.message);
            }
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <Button
        onPress={() => navigation.navigate('AddMember')}
        mode="outlined"
        style={styles.btn}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.light}>
        Inscrire un membre
      </Button>
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
        <View style={styles.viewSelect}>
          <Searchbar
            placeholder="Recherche"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
          <FlatList
            data={returnData()}
            keyExtractor={i => String(i.idmembres)}
            removeClippedSubviews={true}
            initialNumToRender={30}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentScroll}
            contentInsetAdjustmentBehavior="automatic"
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => sendPointage(item)}
                key={item.idmembres}
                style={styles.renderItem}>
                <Text variant="bodyLarge" style={styles.title}>
                  {item.nom} {item.prenoms}
                </Text>
                {renderIcon(item?.idmembres)}
              </TouchableOpacity>
            )}
            refreshing={true}
            refreshControl={
              <RefreshControl
                progressBackgroundColor={theme.colors.primary}
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.light]}
                tintColor={theme.colors.primary}
              />
            }
            onEndReachedThreshold={0.5}
            onEndReached={fetchMoreData}
            ListFooterComponent={<ListFooter loadMore={loadingMore} />}
          />
          {/* {pointageList.length ? (
            <FAB
              icon={() => (
                <Icon
                  name="corner-right-up"
                  color={theme.colors.light}
                  size={20}
                />
              )}
              customSize={40}
              label="Confirmer"
              mode="flat"
              size="small"
              color={theme.colors.light}
              style={[styles.fab, {backgroundColor: theme.colors.primary}]}
              onPress={sendPointage}
            />
          ) : null} */}
        </View>
      ) : null}
      <Snackbar
        duration={3000}
        onIconPress={onDismissSnackBar}
        style={styles.snack}
        visible={visible}
        onDismiss={onDismissSnackBar}>
        <Text style={{color: theme.colors.light}}>{message}</Text>
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
    // paddingTop: Platform.OS === 'ios' ? 20 : 20,
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
    fontWeight: 'bold',
    textAlign: 'justify',
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
    backgroundColor: theme.colors.snack,
    color: theme.colors.light,
  },
  btn: {
    width: Dimensions.get('window').width / 2,
    borderColor: 'transparent',
    alignSelf: 'center',
    marginTop: 15,
  },
});
export default memo(Pointage);

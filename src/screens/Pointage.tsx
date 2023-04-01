import React, {useEffect, useCallback, useContext, useState, memo} from 'react';
import {
  Text,
  Searchbar,
  Snackbar,
  Button,
  Dialog,
  TextInput,
  Portal,
} from 'react-native-paper';
import * as keyChain from 'react-native-keychain';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import {getMembers, addPointage} from '../api';
import theme from '../themes';
import useRefreshToken from '../hooks/useRefreshToken';
import {AuthContext} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import {Membres, Pointage as PointageTypes} from '../types';
import Loader from '../components/Loader';
// import ListFooter from '../components/ListFooter';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import EmptyRenderList from '../components/EmptyRenderList';

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Pointage = ({route}) => {
  const token = useRefreshToken();
  const {state} = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [isView, setIsView] = useState(true);
  const [err, setErr] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [members, setMembers] = useState<Membres[]>([]);
  const [pointageList, setPointageList] = useState<PointageTypes | null>();
  const [refreshing, setRefreshing] = useState(false);
  const [message, SetMessage] = useState('');
  const navigation = useNavigation();

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const req = await getMembers(
        token || state?.token,
        state?.user?.identreprises,
      );
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
  }, [state?.token, state?.user?.identreprises, token]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      try {
        const fetchAllMembers = async () => {
          const req = await getMembers(
            token || state?.token,
            state.user.identreprises,
          );
          if (isActive) {
            const result = req?.sort((a, b) => b.idmembres - a.idmembres);
            setMembers(result);
          }
        };
        fetchAllMembers();
        return () => {
          isActive = false;
        };
      } catch (error) {}
    }, [state?.token, state.user.identreprises, token]),
  );

  useEffect(() => {
    const backAction = () => {
      setVisibleModal(!visibleModal);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const getDate = () => {
    const date = new Date().toLocaleDateString('fr');
    const splitDate = date?.split('/').reverse().join('-');
    return splitDate;
  };

  const returnData = () => {
    if (searchQuery.length && members.length) {
      const filterData = members.filter(
        i =>
          i.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.prenoms.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return filterData ?? members;
    }
    return members;
  };

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
      'Présence',
      'Voulez vous confirmez votre présence',
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
              idculte: route?.params?.idculte,
              identreprises: state.user.identreprises,
            };
            setLoading(!loading);
            const req = await addPointage(data, token || state?.token);
            if (req?.status) {
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

  const onDismissModal = () => {
    setVisibleModal(false);
    setErr('');
    setIsView(false);
  };

  const goToPage = async () => {
    try {
      setLoadingPortal(!loadingPortal);
      const res = await keyChain.getGenericPassword();
      setTimeout(() => {
        if (res) {
          if (res?.password === password) {
            setLoadingPortal(false);
            setVisibleModal(false);
            setErr('');
            setIsView(false);
            setPassword('');
            navigation.goBack();
          } else {
            setLoadingPortal(false);
            setErr('Mot de passe incorrect');
          }
        }
      }, 2000);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <Portal>
        <Dialog
          style={styles.dialog}
          visible={visibleModal}
          onDismiss={onDismissModal}
          dismissable={true}>
          <Dialog.Title style={styles.dialogTitle}>
            Mot de passe pour continuer
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              secureTextEntry={isView}
              placeholderTextColor={theme.colors.grey100}
              style={styles.input}
              autoCapitalize="none"
              value={password}
              label="Mot de passe"
              onChangeText={text => setPassword(text)}
              right={
                <TextInput.Icon
                  icon={isView ? 'eye-off-outline' : 'eye-outline'}
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
              loading={loadingPortal}
              style={styles.btn}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.light}
              onPress={goToPage}>
              Continuer
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Button
        onPress={() => navigation.navigate('AddMember')}
        mode="outlined"
        style={styles.btn}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.light}>
        Inscrire un membre
      </Button>
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
          ListEmptyComponent={
            <EmptyRenderList
              text="Vous n'avez aucun utilisateur enregistré"
              icon="users"
            />
          }
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
          // onEndReachedThreshold={0.5}
          // onEndReached={fetchMoreData}
          // ListFooterComponent={<ListFooter loadMore={loadingMore} />}
        />
      </View>
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
  },
  viewSelect: {
    flex: 1,
  },
  contentScroll: {
    flexGrow: 1,
  },
  textInputStyle: {
    textAlign: 'auto',
    margin: 15,
  },
  input: {
    textAlign: 'auto',
    backgroundColor: theme.colors.light,
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
    backgroundColor: theme.colors.success,
  },
  btn: {
    borderColor: 'transparent',
    alignSelf: 'center',
    marginVertical: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialog: {
    backgroundColor: theme.colors.light,
  },
  err: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
});
export default memo(Pointage);

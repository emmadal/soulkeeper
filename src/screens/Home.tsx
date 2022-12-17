import React, {useContext} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {FAB} from 'react-native-paper';
import theme from '../themes';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const {state} = useContext(AuthContext);
  const navigation = useNavigation();
  console.log('state', state);

  return (
    <View style={styles.wrapper}>
      <FAB
        icon="plus"
        mode="flat"
        size="medium"
        color={theme.colors.light}
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => navigation.navigate('AddMember')}
      />
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
  fab: {
    position: 'absolute',
    margin: 40,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
});

export default Home;

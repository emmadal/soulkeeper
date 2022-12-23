import React, {useContext} from 'react';
import {Text, Avatar, TextInput} from 'react-native-paper';
import {ScrollView, SafeAreaView, StyleSheet, View} from 'react-native';
import theme from '../themes';
import {AuthContext} from '../context/AuthContext';

const Profile = () => {
  const {state} = useContext(AuthContext);

  const renderAvatarName = (name: string) => {
    const characters = name?.split(' ');
    const firstChar = characters[0]?.charAt(0);
    const secondChar = characters[1]?.charAt(0);
    return `${firstChar}${secondChar}`.toUpperCase();
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentScroll}>
        <View style={styles.header}>
          <Avatar.Text
            label={renderAvatarName(state.user.nomentreprise)}
            size={70}
          />
          <Text variant="titleLarge" style={styles.name}>
            {state.user.nomentreprise}
          </Text>
          <Text variant="bodyLarge" style={styles.desc}>
            {state.user.description ?? 'Aucune description disponible'}
          </Text>
        </View>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Nom d'utilisateur"
            mode="outlined"
            value={state.user.login}
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Entreprise"
            mode="outlined"
            value={state.user.nomentreprise}
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Email"
            mode="outlined"
            value={state.user.email}
          />
          <TextInput
            style={styles.input}
            label="Nom du responsable"
            mode="outlined"
            value={state.user.nomresponsable}
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Expediteur"
            mode="outlined"
            value={state.user.expediteur}
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Telephone"
            mode="outlined"
            value={state.user.numero}
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Autre Contact"
            mode="outlined"
            value={state.user.numerotwo ?? ''}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.clouds,
  },
  contentScroll: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  form: {
    marginTop: 25,
  },
  input: {
    textAlign: 'auto',
    marginVertical: 10,
  },
  name: {
    fontWeight: '500',
    marginVertical: 10,
  },
  desc: {
    textAlign: 'center',
  },
});
export default Profile;

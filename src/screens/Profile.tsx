import React from 'react';
import {Text, Avatar, TextInput} from 'react-native-paper';
import {ScrollView, SafeAreaView, StyleSheet, View} from 'react-native';
import theme from '../themes';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentScroll}>
        <View style={styles.header}>
          <Avatar.Text label="BD" size={70} />
          <Text variant="titleLarge">Big Data</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Nom"
            mode="outlined"
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Prénoms"
            mode="outlined"
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Email"
            mode="outlined"
          />
          <TextInput
            style={styles.input}
            label="Nom du responsable"
            mode="outlined"
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Expediteur"
            mode="outlined"
          />
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            label="Telephone"
            mode="outlined"
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
});
export default Profile;

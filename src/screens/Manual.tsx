import React from 'react';
import {Card, Text, Paragraph} from 'react-native-paper';
import {ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import theme from '../themes';

const Manual = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentScroll}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.title}>
              Qu'est ce que Soul Keeper ?
            </Text>
            <Paragraph style={styles.paragraph}>
              Soul Keeper est une application qui permet de faire le suivi des
              membres d'une entreprise. Soul Keeper est en version Mobile et Web
              lesquelles se chargent respectivement de collecter et de traiter
              les données. Dans la rubrique Comment Utiliser Soul Keeper, vous
              apprendrez comment utiliser la version mobile de Soul Keeper
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.title}>
              Comment Faire le pointage ?
            </Text>
            <Paragraph style={styles.paragraph}>
              Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.title}>
              Comment ajouter un nouveau membre ?
            </Text>
            <Paragraph style={styles.paragraph}>
              Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
          </Card.Content>
        </Card>
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
  card: {
    marginVertical: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  paragraph: {
    textAlign: 'justify',
    marginTop: 5,
    lineHeight: 23,
  },
});
export default Manual;

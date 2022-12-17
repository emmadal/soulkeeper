import React from 'react';
import {Text} from 'react-native-paper';
import {ScrollView, SafeAreaView, StyleSheet} from 'react-native';
import theme from '../themes';

const Statistics = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentScroll}>
        <Text variant="titleLarge">Statistics Screen</Text>
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
});
export default Statistics;

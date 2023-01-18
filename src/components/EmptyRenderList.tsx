import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';
import theme from '../themes';

const EmptyRenderList = ({text, icon}: {text: string; icon: string}) => {
  return (
    <View style={[styles.container]}>
      <Icon name={icon} size={50} color={theme.colors.grey100} />
      <Text style={styles.text} variant="titleLarge">
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  text: {
    marginTop: 15,
    color: theme.colors.onBackground,
  },
});

export default EmptyRenderList;

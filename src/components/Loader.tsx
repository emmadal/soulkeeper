import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import theme from '../themes';

const Loader = (props: any) => {
  const {loading} = props;

  return (
    <Modal transparent={loading} visible={loading} onRequestClose={() => null}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
            animating={loading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  activityIndicatorWrapper: {
    backgroundColor: theme.colors.light,
    borderRadius: 120,
    height: 50,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;

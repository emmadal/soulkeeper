import React from 'react';
import {ActivityIndicator} from 'react-native';
import theme from '../themes';

const ListFooter = ({loadMore}) => (
  <ActivityIndicator
    color={theme.colors.primary}
    size="large"
    animating={loadMore}
  />
);

export default ListFooter;

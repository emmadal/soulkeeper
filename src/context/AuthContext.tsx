import {createContext} from 'react';
import {initialState} from '../state';
import {dispatchMethod, State} from '../types';

/**
 * create a type of app context
 */
export type AppContext = {
  state: State;
  dispatch?: dispatchMethod;
};

/**
 * create a App context object
 */
export const AppState: AppContext = {
  state: {
    ...initialState,
  },
};

/**
 * Global context app initialized
 */
export const AuthContext = createContext<AppContext>(AppState);

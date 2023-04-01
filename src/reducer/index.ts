import {initialState} from '../state';
import {State} from '../types';

export enum ActionKind {
  GET_USER = 'GET_USER',
  SIGN_OUT = 'SIGN_OUT',
  RESTORE_TOKEN = 'RESTORE_TOKEN',
}

type Action = {
  type: ActionKind;
  payload?: any;
};

/**
 * reducer pure function which return the current state of app
 */
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.GET_USER:
      return {
        ...state,
        user: action.payload,
        isSignout: false,
      };
    case ActionKind.RESTORE_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case ActionKind.SIGN_OUT:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

export default reducer;

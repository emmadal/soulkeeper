import {initialState} from '../state';
import {State} from '../types';

export enum ActionKind {
  FETCH_DETAILS = 'FETCH_DETAILS',
  SIGN_OUT = 'SIGN_OUT',
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
    case ActionKind.FETCH_DETAILS:
      return {
        ...state,
        user: action.payload,
        isSignout: false,
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

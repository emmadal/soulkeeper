import {State} from '../types';
/**
 * Initial state
 */
export const initialState: State = {
  user: {
    identreprises: 0,
    capture: '',
    nomentreprise: '',
    nomresponsable: '',
    numero: '',
    email: '',
    nomresponsabletwo: '',
    numerotwo: '',
    emailtwo: '',
    password: '',
    idlocalites: 0,
    description: '',
    dateenregistrement: '',
    login: '',
    expediteur: '',
    role: 0,
  },
  token: '',
  isSignout: true,
};

import {Entreprise} from './../types/index';
import * as API from './url.json';

/**
 * Login user
 */
export const loginUser = (
  login: string,
  password: string,
): Promise<Entreprise> =>
  new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({login, password}),
    };
    fetch(API.login, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(() => reject('Echec de la connexion'));
  });

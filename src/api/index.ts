import {Entreprise} from '../types';
import * as API from './url.json';

/**
 * Login user
 */
export const loginUser = async (login: string, password: string) => {
  try {
    const params = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({login, password}),
    };
    const req = await fetch(API.login, params);
    if (req.status === 200) {
      const token = req.headers.get('www-authenticate');
      const res = await req.json();
      return {...res, token};
    }
  } catch (error) {
    return error?.message;
  }
};

export const getUserProfile = (
  username: string,
  token: string,
): Promise<Entreprise> =>
  new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`${API.getUserByUsername}/${username}`, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(() => reject('Echec de la connexion'));
  });

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

/**
 * Get user profile by username
 */
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

/**
 * Get All cities available
 */
export const getCities = (token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(API.localites, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * Get All District available
 */
export const getCommune = (token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(API.commune, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

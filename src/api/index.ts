import {Entreprise, Membres, Pointage} from '../types';
import * as API from './url.json';

/**
 * Login user
 */
export const loginUser = async (login: string, password: string) => {
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
  } else {
    const err = await req.json();
    return err.message;
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
    fetch(API.ville, params)
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

/**
 * Get All Cultes available
 */
export const getCultes = (token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(API.cultes, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * Get All Country
 */
export const getCountry = (token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(API.pays, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * Add member
 */
export const addMember = (data: Membres, token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({...data}),
    };
    fetch(API.addMembre, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * get all members
 */
export const getMembers = (token: string, size: number, page: number) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`${API.members}?page=${page}&size=${size}`, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * Add Pointage
 */
export const addPointage = (data: Pointage[], token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({pointage: data}),
    };
    fetch(API.pointage, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * Get stats
 */
export const getStatistiques = (
  date: string,
  idculte: number,
  identreprises: number | undefined,
  token: string,
) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({date, idculte, identreprises}),
    };
    fetch(API.stats, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

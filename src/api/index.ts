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
      method: 'POST',
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
export const getCities = (token: string, identreprises: number | undefined) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({identreprises}),
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
export const getCommune = (
  token: string,
  identreprises: number | undefined,
) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({identreprises}),
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
export const getCultes = (token: string, identreprises: number | undefined) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({identreprises}),
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
      method: 'POST',
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
export const getMembers = (
  token: string,
  identreprises: number | undefined,
) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({identreprises}),
    };
    fetch(API.members, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

/**
 * Add Pointage
 */
export const addPointage = (data: Pointage, token: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({...data}),
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
export const getStatistiques = (token: string, data: any) => {
  return new Promise((resolve, reject) => {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({...data}),
    };
    fetch(API.stats, params)
      .then(res => res.json())
      .then(e => resolve(e))
      .catch(err => reject(err));
  });
};

// reverse coding
export const reverseGeocoding = async (lat: number, lng: number) => {
  const key = 'pk.47b1f92837bbd696ccd8a7e0a25a492f';
  const url = `https://eu1.locationiq.com/v1/reverse.php?key=${key}&lat=${lat}&lon=${lng}&format=json`;
  const params = {
    method: 'GET',
    redirect: 'follow',
  };
  const req = await fetch(url, params);
  if (req.status === 200) {
    return await req.json();
  }
};

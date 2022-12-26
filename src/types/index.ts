/**
 * Entreprise type
 */
export type Entreprise = {
  identreprises?: number;
  capture: string;
  nomentreprise: string;
  nomresponsable: string;
  numero: string;
  email: string;
  nomresponsabletwo?: string;
  numerotwo?: string;
  emailtwo?: string;
  password: string;
  idlocalites?: number;
  description?: string;
  dateenregistrement?: string;
  login: string;
  expediteur?: string;
  role?: number;
};

/**
 * Membres type
 */
export type Membres = {
  idmembres?: number;
  nom: string;
  prenoms: string;
  contact?: string;
  date_naissance: string;
  autre_contact: string;
  quartier: string;
  idprofession?: number;
  email?: string;
  dateenregistre?: Date;
  genre?: number;
  identreprises: number;
  idville?: number;
  idcommune?: number;
  idpays?: number;
};

/**
 * pointage type
 */
export type Pointage = {
  idpointage?: number;
  date: string;
  idmembres: number;
  idculte: number;
  Operateur?: string;
  identreprises: number;
};

/**
 * State type contain the App state
 */
export type State = {
  user: Entreprise;
  isSignout: boolean;
  token: string;
};

/**
 * dispatchMethod type contains all method to dispatch an action
 */
export type dispatchMethod = {
  getUser: (user: Entreprise) => void;
  restoreToken: (token: string) => void;
  signOut: () => void;
};

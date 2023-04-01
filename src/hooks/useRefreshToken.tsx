import {useEffect, useContext, useState} from 'react';
import * as keyChain from 'react-native-keychain';
import {loginUser} from '../api';
import {AuthContext} from '../context/AuthContext';

const useRefreshToken = () => {
  const {dispatch} = useContext(AuthContext);
  const [token, setToken] = useState('');

  useEffect(() => {
    // re-login and restore token each 3min
    const timeout = setInterval(async () => {
      const res = await keyChain.getGenericPassword();
      if (res) {
        const user = await loginUser(res.username, res.password);
        setToken(user?.token);
        dispatch?.restoreToken(user?.token);
      } else {
        dispatch?.signOut();
      }
    }, 180000);
    return () => clearInterval(timeout);
  }, []);
  return token;
};

export default useRefreshToken;

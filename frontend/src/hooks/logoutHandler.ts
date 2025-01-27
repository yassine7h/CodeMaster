import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../utils/HttpClient';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useHttpErrorHandler } from './httpErrorHandler';

const useLogout = () => {
   const navigate = useNavigate();
   const httpErrorHandler = useHttpErrorHandler();
   const { clear } = useGlobalContext();

   const logout = useCallback(() => {
      http
         .post('/accounts/logout')
         .then(() => {
            http.removeToken();
            clear();
            navigate('/auth/signin', { replace: true });
         })
         .catch(httpErrorHandler);
   }, [navigate]);

   return logout;
};

export default useLogout;

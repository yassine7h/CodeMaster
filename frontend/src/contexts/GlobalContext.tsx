import React, { createContext, useContext, useState } from 'react';
import { http } from '../utils/HttpClient';

export interface User {
   id: number;
   avatar: string;
   username: string;
   email: string;
   roles: string[];
}

interface GlobalContextValueType {
   user: User | null;
}

interface GlobalContextType {
   value: GlobalContextValueType;
   setUser: (user: User) => void;
   clear: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
   const context = useContext(GlobalContext);
   if (!context) {
      throw new Error('useUserContext must be used within a UserProvider');
   }
   return context;
};

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [value, setValueState] = useState<GlobalContextValueType>({ user: null });
   const [render, setRender] = useState<Boolean>(false);

   const setUser = (user: User) => {
      setValueState((value) => {
         value.user = user;
         return value;
      });
   };

   const clear = () => {
      setValueState({
         user: null,
      });
   };

   (function () {
      http
         .get('/accounts/me')
         .then((response) => {
            const user = (response?.data as { user: User }).user;
            setUser(user);
         })
         .finally(() => {
            setRender(true);
         });
   })();

   if (render) return <GlobalContext.Provider value={{ value, setUser, clear }}>{children}</GlobalContext.Provider>;
};

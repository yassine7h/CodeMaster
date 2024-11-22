import React, { createContext, useState, ReactNode } from "react";

// Define the type for the context value
export type MainContextType = {
   key: string;
} | null;

export const MainContext = createContext<{
   value: MainContextType;
   setValue: React.Dispatch<React.SetStateAction<MainContextType>>;
} | null>(null);

export const MainContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [value, setValue] = useState<MainContextType>(null);

   return <MainContext.Provider value={{ value, setValue }}>{children}</MainContext.Provider>;
};

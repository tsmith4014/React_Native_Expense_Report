// AuthContext.js
import React from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
  const [token, setToken] = React.useState(null);

  return (
    <AuthContext.Provider value={{token, setToken}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

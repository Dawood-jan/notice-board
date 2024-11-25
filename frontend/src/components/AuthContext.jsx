import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const savedAuth = JSON.parse(localStorage.getItem('auth'));
    return savedAuth || {
      token: null,
      id: null,
      email: null,
      isLoading: false,
      fullname: null,
      role: null,
      department: null,
      semester: null,
      photoUrl: null,
    };
  });

  const login = (authData) => {
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setAuth({
      token: null,
      id: null,
      email: null,
      fullname: null,
      role: null,
      semester: null,
      department: null,
      photoUrl: null,
    });
  };

  const updateProfile = (updatedData) => {
    const newAuth = { ...auth, ...updatedData };
    localStorage.setItem('auth', JSON.stringify(newAuth));
    setAuth(newAuth);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

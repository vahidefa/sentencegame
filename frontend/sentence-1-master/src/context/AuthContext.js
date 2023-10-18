import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const loginUser = (userData) => {
    setToken(userData);
    const modifiedToken = userData.replace(/['"]+/g, "");
    localStorage.setItem("token", JSON.stringify(modifiedToken));
  };

  const logoutUser = () => {
    // setToken(null);
    localStorage.removeItem("token");
    window.location.reload();
  };

  const value = {
    token,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("token");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setToken(parsedUser);
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

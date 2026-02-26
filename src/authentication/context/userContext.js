// contexts/UserContext.js
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const useCurrentUser = () => {
  return useContext(UserContext);
};




export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("userData")));

  const UserInfo = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, UserInfo, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

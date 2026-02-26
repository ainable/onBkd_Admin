import { createContext, useState, useContext } from "react";



const AuthContext = createContext();


export const ROLE = {
  SUPER_ADMIN: 'SuperAdmin',
  ORDER_MANAGE: 'OrderManager',
  CONTENT_MANAGE: 'CatalogueAndContentManager',
};

export const roleAccess = {
  [ROLE.SUPER_ADMIN]: ['all'], // Access to everything
  [ROLE.ORDER_MANAGE]: ['orders', 'returns'],
  [ROLE.CONTENT_MANAGE]: ['cms'],
};

export const useAuth = () => {
  return useContext(AuthContext);
};




export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [fcmtoken, setFcmToken] = useState(
    localStorage.getItem("fcmtoken") || null
  );
  const [role, setRole] = useState(localStorage.getItem("role") || null)
  const [permissions, setPermissions] = useState((localStorage.getItem("permissions")) || [])

  const getRole = (role) => {
    setRole(role)
  }

  const getPermissions = (permission) => {
    setPermissions(permission)
  }

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
  };
  // const getFcmToken=(fcm)=>{
  //   setFcmToken(fcm)
  // }

  return (
    <AuthContext.Provider
      value={{ token, login, logout, setFcmToken, fcmtoken, getRole, getPermissions, role, permissions }}
    >
      {children}
    </AuthContext.Provider>
  );
};

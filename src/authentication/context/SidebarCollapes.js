// contexts/UserContext.js
import React, { createContext, useState, useContext } from "react";

const CollapeContext = createContext();

export const useCollapes = () => {
  return useContext(CollapeContext);
};

export const CollapesProvider = ({ children }) => {
  const [collape, setCollape] = useState(false);

  const handleCollape = () => {
    setCollape((pre)=>!pre);
  };

  return (
    <CollapeContext.Provider value={{ collape, handleCollape }}>
      {children}
    </CollapeContext.Provider>
  );
};

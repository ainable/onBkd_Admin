import { createContext, useState, useContext, useEffect } from 'react';

const ScreenContext = createContext();

export const useScreen = () => {
  return useContext(ScreenContext);
};

export const ScreenProvider = ({ children }) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  
    // Function to update screen dimensions
    const updateScreenDimensions = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
  
    useEffect(() => {
      updateScreenDimensions(); // Set initial dimensions
  
      // Add event listener for window resize
      window.addEventListener("resize", updateScreenDimensions);
  
      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener("resize", updateScreenDimensions);
      };
    }, []);

  return (
    <ScreenContext.Provider value={{ screenWidth, screenHeight }}>
      {children}
    </ScreenContext.Provider>
  );
};

// LocationContext.js


const LocationContext = createContext();
export const useCurrentLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(JSON.parse(localStorage.getItem("location")) || null);

  return (
    <LocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};



import "./App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./authentication/context/authContext";
import routes from "./pages/AllRoutes";
import { UserProvider } from "./authentication/context/userContext";

import { useEffect, useState } from "react";
import { CollapesProvider } from "./authentication/context/SidebarCollapes";
import NotFound from "./pages/NotFound";
// import { getToken, messaging, onMessage } from "./firebase";
import Logo from "./assest/png/bkdlogo.png";
// import { getToken, messaging, onMessage } from "./firebase"; // DISABLED - FIREBASE CAUSING ERRORS

function App() {
  // const { setFcmToken } = useAuth(); // DISABLED - FIREBASE FCM TOKEN
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // const FcmAccessTokens = process.env.REACT_APP_FCM_TOKEN; // DISABLED

  // console.log("FcmAccessTokens", FcmAccessTokens) // DISABLED

  /* DISABLED - FIREBASE FCM FUNCTIONALITY CAUSING onMessageHandler NULL ERROR
  useEffect(() => {
    const requestPermissionAndToken = async () => {
      try {
        // Check current notification permission
        const currentPermission = Notification.permission;

        // If permission is already granted, directly get the FCM token
        if (currentPermission === "granted") {
          const tokens = await getToken(messaging, {
            vapidKey: FcmAccessTokens,
          });
          console.log("FCM Token:", tokens);
          setFcmToken(tokens); // Send or store the token as needed
          localStorage.setItem("fcmtoken", tokens);
        } else if (
          currentPermission === "default" ||
          currentPermission === "denied"
        ) {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const tokens = await getToken(messaging, {
              vapidKey: FcmAccessTokens,
            });
            console.log("FCM Token:", tokens);
            setFcmToken(tokens); // Send or store the token as needed
            localStorage.setItem("fcmtoken", tokens);
          } else {
            console.error("Permission not granted for notifications");
          }

        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    requestPermissionAndToken();
  }, [messaging, FcmAccessTokens, setFcmToken]);
  */



  return (
    <div className="App">
      <div className="dashboard">
        <CollapesProvider>
          <AuthProvider>
            <UserProvider>
              <div className="contentSection">
                <div className="childroute">
                  <Routes>
                    {routes.map((route, index) => {
                      if (route.children) {
                        return (
                          <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                          >
                            {route.children.map((childRoute, childIndex) => (
                              <Route
                                key={childIndex}
                                path={childRoute.path}
                                element={childRoute.element}
                              />
                            ))}
                          </Route>
                        );
                      }
                      return (
                        <Route
                          key={index}
                          path={route.path}
                          element={route.element}
                        />
                      );
                    })}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </UserProvider>
          </AuthProvider>
        </CollapesProvider>
      </div>
    </div>
  );
}

export default App;

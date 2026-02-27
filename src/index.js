import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authentication/context/authContext";
import { UserProvider } from "./authentication/context/userContext";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux-toolkit/Store";

const themeConfig = {
  token: {
    colorSecondry: "#F2F2F3",
    colorPrimary: "#5AC268", // Change this to your preferred primary color
  },
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <ConfigProvider theme={themeConfig}>
            <App />
          </ConfigProvider>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  </Provider>

);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyBKLiP6dTJilNupoUGUwykqckWyFJiZYYY",
    authDomain: "bkd-push-notification-a0a45.firebaseapp.com",
    projectId: "bkd-push-notification-a0a45",
    storageBucket: "bkd-push-notification-a0a45.appspot.com",
    messagingSenderId: "905967913050",
    appId: "1:905967913050:web:1fa8c501f26d583ddcb063",
    measurementId: "G-PX888GVGTF"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export  {messaging,getToken,onMessage};
importScripts(
    "https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js"
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js"
  );
  
  const firebaseConfig = {
    apiKey: "AIzaSyBKLiP6dTJilNupoUGUwykqckWyFJiZYYY",
    authDomain: "bkd-push-notification-a0a45.firebaseapp.com",
    projectId: "bkd-push-notification-a0a45",
    storageBucket: "bkd-push-notification-a0a45.appspot.com",
    messagingSenderId: "905967913050",
    appId: "1:905967913050:web:e6f033d6c30ebdcddcb063",
    measurementId: "G-B29EPMQD00"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const messaging = firebase.messaging();
  
  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/firebase-logo.png",
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyDMbaB7KJhIjoJT5JcVWuW7RbQ7b96Hxn8",
  authDomain: "hucourseswap.firebaseapp.com",
  projectId: "hucourseswap",
  storageBucket: "hucourseswap.firebasestorage.app",
  messagingSenderId: "1066163183237",
  appId: "1:1066163183237:web:d2141f61064ed13ad853ec",
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

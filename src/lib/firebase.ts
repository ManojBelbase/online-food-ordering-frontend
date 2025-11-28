  // lib/firebase.ts
  import { initializeApp, getApps, getApp } from "firebase/app";
  import { getDatabase } from "firebase/database";

  const firebaseConfig = {
    apiKey: "AIzaSyDriyjZ7WkimxoqiJMt0gZ3izRBi9eNmq8",
    authDomain: "food-ordering-6a1bf.firebaseapp.com",
    databaseURL: "https://food-ordering-6a1bf-default-rtdb.firebaseio.com",
    projectId: "food-ordering-6a1bf",
    storageBucket: "food-ordering-6a1bf.firebasestorage.app",
    messagingSenderId: "682475636956",
    appId: "1:682475636956:web:eb9ce9a221edc0309d0c19",
    measurementId: "G-9RX76W58Q4",
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  export const database = getDatabase(app);

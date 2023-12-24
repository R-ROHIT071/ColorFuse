// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA0i60LSW7jG3ArKwVneTP0nk-NpOoVu94",
    authDomain: "prajna-37d1c.firebaseapp.com",
    databaseURL: "https://prajna-37d1c.firebaseio.com",
    projectId: "prajna-37d1c",
    storageBucket: "prajna-37d1c.appspot.com",
    messagingSenderId: "469291960872",
    appId: "1:469291960872:web:08277c423a78407e9d831d",
    measurementId: "G-YP9M24F51E"
  };
  
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage();

export { app ,auth, database, storage, ref, set, push};
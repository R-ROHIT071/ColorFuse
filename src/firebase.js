// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBF4jRvK9i7uawnCcl9t9lQhXjzhLe27B0",
    authDomain: "creative-ai-364b0.firebaseapp.com",
    projectId: "creative-ai-364b0",
    databaseURL: "https://creative-ai-364b0-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "creative-ai-364b0.appspot.com",
    messagingSenderId: "498263200200",
    appId: "1:498263200200:web:576d115681308f033db0fd",
    measurementId: "G-GD4LNJPVDP",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
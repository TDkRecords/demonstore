// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJxvBWM8xcqUkvXuHTwMzhPZk9QPUSVlA",
    authDomain: "demonstore-fa245.firebaseapp.com",
    projectId: "demonstore-fa245",
    storageBucket: "demonstore-fa245.firebasestorage.app",
    messagingSenderId: "499405069963",
    appId: "1:499405069963:web:7525eb6a4dac089fc8be8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    app,
    db,
};
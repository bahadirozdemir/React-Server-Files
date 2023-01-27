import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAsSmloi0E_nb6OX8vAUwRBk5FJH6eRc5E",
    authDomain: "react-64d88.firebaseapp.com",
    projectId: "react-64d88",
    storageBucket: "react-64d88.appspot.com",
    messagingSenderId: "572780960481",
    appId: "1:572780960481:web:7a2212af7512dd153c35a0",
    measurementId: "G-YVJF7HGKGS"
  };
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);


 
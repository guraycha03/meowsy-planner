// lib/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBCgFpz8DG9TLbKxZ0EO0YyaG3n4_r5bBk",
  authDomain: "digitalplanner-380e6.firebaseapp.com",
  projectId: "digitalplanner-380e6",
  storageBucket: "digitalplanner-380e6.appspot.com",
  messagingSenderId: "207987722138",
  appId: "1:207987722138:web:4d36e337880316201ddc23",
  measurementId: "G-61D7GP7636",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

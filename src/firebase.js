import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuvtpx6FJFFr7KGiGkVdE5QShW6DHJbXE",
  authDomain: "super-market-pro.firebaseapp.com",
  projectId: "super-market-pro",
  storageBucket: "super-market-pro.firebasestorage.app",
  messagingSenderId: "327756720853",
  appId: "1:327756720853:web:5791a47a343a4d9958505c",
  measurementId: "G-XVWRTYCJF7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  serverTimestamp
};

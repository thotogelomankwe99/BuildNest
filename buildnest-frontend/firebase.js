// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
 import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
 apiKey: "AIzaSyBSRtloJWSAe5Y26IGOAyaNRFZ7kTpS19M",
  authDomain: "buildnest-57551.firebaseapp.com",
  projectId: "buildnest-57551",
  storageBucket: "buildnest-57551.firebasestorage.app",
  messagingSenderId: "45413880619",
  appId: "1:45413880619:web:e59af8e641435a0a0eab6e",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

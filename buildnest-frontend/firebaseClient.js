import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
     apiKey: "AIzaSyBSRtloJWSAe5Y26IGOAyaNRFZ7kTpS19M",
  authDomain: "buildnest-57551.firebaseapp.com",
  projectId: "buildnest-57551",
  storageBucket: "buildnest-57551.firebasestorage.app",
  messagingSenderId: "45413880619",
  appId: "1:45413880619:web:e59af8e641435a0a0eab6e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signupWithEmail(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  await sendTokenToBackend(token);
  alert("Signup successful!");
}

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  await sendTokenToBackend(token);
  alert("Login successful!");
  window.location.href = "dashboard.html";
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const token = await userCredential.user.getIdToken();
  await sendTokenToBackend(token);
  alert("Login with Google successful!");
  window.location.href = "dashboard.html";
}

async function sendTokenToBackend(token) {
  await fetch("http://localhost:3000/api/login-firebase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

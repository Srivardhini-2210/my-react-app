// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLdVvlbGFTZGQOpXtm_1cmGkhCmgT9pys",
  authDomain: "e-learning-platform-comparator.firebaseapp.com",
  projectId: "e-learning-platform-comparator",
  storageBucket: "e-learning-platform-comparator.appspot.com",
  messagingSenderId: "21908886643",
  appId: "1:21908886643:web:334a75de19abc15f558606",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signInWithEmailAndPassword };

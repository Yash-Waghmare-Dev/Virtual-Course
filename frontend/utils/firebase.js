// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginvirtualcourses-98d3e.firebaseapp.com",
  projectId: "loginvirtualcourses-98d3e",
  storageBucket: "loginvirtualcourses-98d3e.firebasestorage.app",
  messagingSenderId: "886313949078",
  appId: "1:886313949078:web:8024ed21dfe7d9b0fd2fb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export { auth, provider };
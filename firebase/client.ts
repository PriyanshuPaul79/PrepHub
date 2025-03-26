// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRV7Aa4h6LMhPQJeUiLITEai9Grp2CY3o",
  authDomain: "interviewprep-21a71.firebaseapp.com",
  projectId: "interviewprep-21a71",
  storageBucket: "interviewprep-21a71.firebasestorage.app",
  messagingSenderId: "777755902154",
  appId: "1:777755902154:web:6ff901abb3b2c60f54f433",
  measurementId: "G-8VR1KERBEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
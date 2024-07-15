import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJk9JHk4A_6s_ZJRYrSi2HINojLuRaxQU",
  authDomain: "chat-app-7a610.firebaseapp.com",
  projectId: "chat-app-7a610",
  storageBucket: "chat-app-7a610.appspot.com",
  messagingSenderId: "96533871605",
  appId: "1:96533871605:web:71f405a55ad5f5eaf5bebc",
  measurementId: "G-WQM3N0QD7S",
  databaseURL:
    "https://chat-app-7a610-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

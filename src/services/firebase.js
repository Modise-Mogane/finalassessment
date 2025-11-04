import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBzZfiw-25AK2HL6dWmta3URB9fjquUTfY",
  authDomain: "modise-a91a8.firebaseapp.com",
  projectId: "modise-a91a8",
  storageBucket: "modise-a91a8.firebasestorage.app",
  messagingSenderId: "609416764600",
  appId: "1:609416764600:web:18b640eab0b9482ca1a84d",
  measurementId: "G-KX15ZB6G8N",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

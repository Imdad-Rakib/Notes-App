import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDkvf3Jvv5UqwOXWasckWuMX6opq839qa4",
    authDomain: "react-19110.firebaseapp.com",
    projectId: "react-19110",
    storageBucket: "react-19110.appspot.com",
    messagingSenderId: "298719913959",
    appId: "1:298719913959:web:fe2566e8c8d79daf3b3f42"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
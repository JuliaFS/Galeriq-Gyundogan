import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCUXpxfTu1Xwgf_NaLXeKRGl4Et3mFdSbg",
    authDomain: "galeriq-gyundogan.firebaseapp.com",
    projectId: "galeriq-gyundogan",
    storageBucket: "galeriq-gyundogan.appspot.com",
    messagingSenderId: "621172965260",
    appId: "1:621172965260:web:80bd34ee0824bcf45760a9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
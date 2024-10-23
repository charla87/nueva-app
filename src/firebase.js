import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBD30aRwoRk-_uCgmREcIWBCOcquuP7ZAg",
    authDomain: "miapp-8f292.firebaseapp.com",
    projectId: "miapp-8f292",
    storageBucket: "miapp-8f292.appspot.com",
    messagingSenderId: "315771591161",
    appId: "1:315771591161:web:51054c9afd827d444f8528",
    measurementId: "G-BHTGJJRXZW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
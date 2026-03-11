import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
apiKey:"AIzaSyDKROzPt8ZaQXk_m5sMEY853BCafnZFb4o",
authDomain:"trendoptik.firebaseapp.com",
projectId:"trendoptik",
storageBucket:"trendoptik.firebasestorage.app",
messagingSenderId:"645619125341",
appId:"1:645619125341:web:a43aad6e213c80fbe351b4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
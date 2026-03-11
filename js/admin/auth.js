import { auth } from "../firebase-init.js";
import { signInWithEmailAndPassword,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if(loginBtn){

loginBtn.onclick = ()=>{

const email = document.getElementById("emailInput").value;
const pass = document.getElementById("passwordInput").value;

signInWithEmailAndPassword(auth,email,pass)

}

}

if(logoutBtn){

logoutBtn.onclick = ()=> signOut(auth)

}

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="admin.html";

}

});

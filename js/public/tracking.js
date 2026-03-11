import { db } from "../firebase-init.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const btn = document.getElementById("trackBtn");

if(btn){

btn.onclick = async ()=>{

const phone = document.getElementById("trackPhone").value;

const snap = await getDocs(collection(db,"orders"));

let found = null;

snap.forEach(doc=>{

const d = doc.data();

if(d.phone === phone){
found = d;
}

});

const result = document.getElementById("trackResult");

result.style.display = "block";

if(found){

result.innerHTML = `
<h6>${found.customerName}</h6>
<p>${found.product}</p>
<b>${found.status}</b>
`;

}else{

result.innerHTML = "Sipariş bulunamadı.";

}

}

}
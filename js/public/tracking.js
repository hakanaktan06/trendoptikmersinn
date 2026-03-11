import { db } from "../firebase-init.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { normalizePhone } from "../shared/phone.js";

const btn = document.getElementById("trackBtn");
const input = document.getElementById("trackPhone");
const result = document.getElementById("trackResult");

if(btn){

btn.addEventListener("click",async()=>{

const phone = normalizePhone(input.value);

const snap = await getDocs(collection(db,"orders"));

let found = null;

snap.forEach(doc=>{

const d = doc.data();

if(normalizePhone(d.phone) === phone){

found = d;

}

});

result.style.display="block";

if(found){

result.innerHTML = `
<h6>${found.customerName}</h6>
<p>${found.product}</p>
<b>${found.status}</b>
`;

}else{

result.innerHTML = "Sipariş bulunamadı.";

}

});

}

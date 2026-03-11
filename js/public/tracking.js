import { db } from "../firebase-init.js";
import { collection,getDocs,query } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const trackBtn=document.getElementById("trackBtn")
const trackPhone=document.getElementById("trackPhone")
const trackResult=document.getElementById("trackResult")

if(trackBtn){

trackBtn.addEventListener("click",async()=>{

const phone=trackPhone.value.trim()

if(!phone) return alert("Telefon girin")

trackBtn.disabled=true

try{

const qs=await getDocs(query(collection(db,"orders")))

let found=null

qs.forEach(doc=>{
if(doc.data().phone===phone) found=doc.data()
})

trackResult.style.display="block"

if(found){

trackResult.innerHTML=`
<h6>${found.customerName}</h6>
<p>${found.product}</p>
<b>${found.status}</b>
`

}else{

trackResult.innerHTML="Sipariş bulunamadı"

}

}catch(e){

trackResult.innerHTML="Hata oluştu"

}

trackBtn.disabled=false

})

}
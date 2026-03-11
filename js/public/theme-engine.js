import { db } from "../firebase-init.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

let currentTheme = "standart";

const themeData = {
  standart:{color:"#f5a623",wpBtn:'<i class="bi bi-whatsapp"></i> Sor',wpMsg:"Merhaba Trend Optik! Sitenizdeki",ribbon:""},
  yilbasi:{color:"#00b4d8",wpBtn:'<i class="bi bi-gift-fill"></i> Yeni Yıl Hediyesi',wpMsg:"Trend Optik yeni yıl hediyesi olarak",ribbon:'<div class="theme-ribbon bg-info">❄️ Yılbaşı</div>'},
  sevgililer:{color:"#ff3366",wpBtn:'<i class="bi bi-suit-heart-fill"></i> Sevgilime',wpMsg:"Trend Optik Sevgililer Günü için",ribbon:'<div class="theme-ribbon" style="background:#ff3366;">❤️ Aşkla</div>'}
};

function applyColorEngine(color){
const style=document.createElement("style");
style.innerHTML=`
:root{--theme-color:${color}}
.accent{color:var(--theme-color)!important}
.btn-accent{background:var(--theme-color)!important;color:#fff;border:none}
.product-card:hover{border-color:var(--theme-color)!important}
`;
document.head.appendChild(style);
}

async function initializeTheme(){

try{
const snap=await getDoc(doc(db,"settings","theme"))
if(snap.exists()) currentTheme=snap.data().activeTheme || "standart"
}catch(e){}

applyColorEngine(themeData[currentTheme].color)

}

initializeTheme()

export {currentTheme,themeData}
import { db } from "../firebase-init.js";
import { currentTheme,themeData } from "./theme-engine.js";
import { collection,getDocs,query,orderBy,limit,updateDoc,doc,increment } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const homeProductGrid=document.getElementById("homeProductGrid")
const allProductGrid=document.getElementById("allProductGrid")

let allProducts=[]

window.askWhatsApp=async function(id,link){
window.open(link,"_blank")
try{await updateDoc(doc(db,"products",id),{clicks:increment(1)})}catch(e){}
}

window.shareProduct=function(name,price){
const text=`Trend Optik'te şu modele bayıldım\n${name}\n${price}`
navigator.clipboard.writeText(text)
alert("Kopyalandı")
}

function createProductCard(product,index,isSlider=false){

const finalPrice=product.price.toString().includes("₺")?product.price:`${product.price} ₺`
const t=themeData[currentTheme]

const wpMessage=`${t.wpMsg} "${product.name}" modeliyle ilgileniyorum`
const wpLink=`https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`

const gridClass=isSlider?"product-slide-item":"col-lg-3 col-md-6 mb-4"

return `
<div class="${gridClass}">
<div class="card product-card position-relative">

${t.ribbon}

<img src="${product.img}" style="height:250px;width:100%;object-fit:contain">

<div class="card-body text-center">

<h5>${product.name}</h5>
<p>${product.desc}</p>
<p class="accent fw-bold">${finalPrice}</p>

<button onclick="askWhatsApp('${product.id}','${wpLink}')" class="btn btn-accent">WhatsApp</button>

<button onclick="shareProduct('${product.name}','${finalPrice}')" class="btn btn-accent">
<i class="bi bi-share"></i>
</button>

</div>

</div>
</div>
`
}

async function fetchHomeProducts(){

if(!homeProductGrid) return

const qs=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc"),limit(6)))

let html=""
let i=0

qs.forEach(doc=>{
html+=createProductCard({id:doc.id,...doc.data()},i++,true)
})

homeProductGrid.innerHTML=html+html

}

async function fetchAllProducts(){

if(!allProductGrid) return

const qs=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc")))

allProducts=[]
qs.forEach(doc=>{
allProducts.push({id:doc.id,...doc.data()})
})

displayAllProducts(allProducts)

}

function displayAllProducts(list){

if(!allProductGrid) return

allProductGrid.innerHTML=""

list.forEach((p,i)=>{
allProductGrid.innerHTML+=createProductCard(p,i,false)
})

}

fetchHomeProducts()
fetchAllProducts()
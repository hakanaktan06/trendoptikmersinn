import { db } from "../firebase-init.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const homeProductGrid = document.getElementById("homeProductGrid");

async function fetchProducts(){

  if(!homeProductGrid) return;

  const q = query(
    collection(db,"products"),
    orderBy("createdAt","desc"),
    limit(6)
  );

  const snap = await getDocs(q);

  let html = "";

  snap.forEach(doc=>{

    const p = doc.data();

    html += `
    
    <div class="product-slide-item">

      <div class="product-card">

        <img src="${p.img}" />

        <h5>${p.name}</h5>

        <p>${p.desc}</p>

        <b>${p.price} ₺</b>

      </div>

    </div>
    
    `;

  });

  homeProductGrid.innerHTML = html + html;

}

fetchProducts();

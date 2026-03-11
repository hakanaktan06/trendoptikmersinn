// Firebase Importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, updateDoc, doc, increment, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKROzPt8ZaQXk_m5sMEY853BCafnZFb4o",
  authDomain: "trendoptik.firebaseapp.com",
  projectId: "trendoptik",
  storageBucket: "trendoptik.firebasestorage.app",
  messagingSenderId: "645619125341",
  appId: "1:645619125341:web:a43aad6e213c80fbe351b4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  
  // ==========================================
  // PROFESYONEL CSS TEMA MOTORU
  // ==========================================
  async function loadEliteTheme() {
    try {
      const snap = await getDoc(doc(db, "settings", "theme"));
      if (snap.exists() && snap.data().activeTheme !== "standart") {
        applyAdvancedTheme(snap.data().activeTheme);
      }
    } catch (e) { console.log("Tema yüklenemedi", e); }
  }

  function applyAdvancedTheme(theme) {
    const style = document.createElement('style');
    let css = ''; let html = '';

    if (theme === 'yilbasi') {
      // 1. YILBAŞI: Kutuların üzerinde kar birikintisi ve kar yağışı
      css = `
        body { background-color: #050508 !important; }
        .product-card { overflow: visible !important; border-top: 1px solid rgba(255,255,255,0.4); }
        /* Kutu üzerindeki kar efekti (Pseudo-element) */
        .product-card::before {
            content: ''; position: absolute; top: -10px; left: -2%; width: 104%; height: 20px;
            background: #fff; border-radius: 10px 10px 20px 20px; z-index: 10; pointer-events: none;
            box-shadow: inset 0 -3px 5px rgba(0,0,0,0.1), 0 5px 15px rgba(255,255,255,0.3);
            filter: drop-shadow(0 2px 2px #fff);
        }
        .snow-flake { position: fixed; top: -10vh; color: white; user-select: none; z-index: 9999; animation: fall linear infinite; text-shadow: 0 0 5px rgba(255,255,255,0.8); pointer-events: none; }
        @keyframes fall { 100% { transform: translateY(110vh) rotate(360deg); } }
      `;
    } 
    else if (theme === 'sevgililer') {
      // 2. SEVGİLİLER GÜNÜ: İpli dev kalp balonları ve kutu efekti
      css = `
        .product-card { border: 1px solid rgba(255,51,102,0.3); box-shadow: 0 5px 20px rgba(255,51,102,0.05); }
        .theme-balloon { font-size: 70px; position: fixed; bottom: 50px; filter: drop-shadow(0 10px 15px rgba(255,51,102,0.6)); animation: floatBalloon 4s ease-in-out infinite alternate; z-index: 9999; pointer-events:none; }
        /* Balon İpi (Sihirli CSS dokunuşu) */
        .theme-balloon::after { content:''; position:absolute; bottom:-60px; left:50%; width:2px; height:80px; background:rgba(255,255,255,0.3); z-index:-1; transform:translateX(-50%); }
        .theme-balloon.left { left: 5%; } .theme-balloon.right { right: 5%; animation-delay: 1.5s; }
        @keyframes floatBalloon { 0% { transform: translateY(0) rotate(-5deg); } 100% { transform: translateY(-25px) rotate(5deg); } }
      `;
      html = `<div class="theme-balloon left">💖</div><div class="theme-balloon right">💖</div>`;
    }
    else if (theme === 'bayram') {
      // 3. BAYRAM: Tavandan sarkan altın kandiller
      css = `
        .product-card { border: 1px solid rgba(245, 166, 35, 0.3); }
        .theme-lantern { font-size: 70px; position: fixed; top: 60px; filter: drop-shadow(0 10px 15px rgba(245, 166, 35, 0.5)); transform-origin: top center; animation: swing 3s ease-in-out infinite alternate; z-index: 9999; pointer-events:none; }
        /* Kandil İpi */
        .theme-lantern::before { content:''; position:absolute; top:-80px; left:50%; width:2px; height:80px; background:#f5a623; transform:translateX(-50%); }
        .theme-lantern.left { left: 5%; animation-delay: 0.5s; } .theme-lantern.right { right: 5%; }
        @keyframes swing { 0% { transform: rotate(5deg); } 100% { transform: rotate(-5deg); } }
      `;
      html = `<div class="theme-lantern left">🏮</div><div class="theme-lantern right">🏮</div>`;
    }
    else if (theme === 'kadinlar') {
      // 4. KADINLAR GÜNÜ: Zarif Çiçekler ve Mor detaylar
      css = `
        .product-card { border: 1px solid rgba(156, 39, 176, 0.3); }
        .accent { color: #d05ce3 !important; } .btn-accent { background: #d05ce3 !important; color: white !important; }
        .theme-flower { font-size: 80px; position: fixed; bottom: -10px; filter: drop-shadow(0 0 20px #d05ce3); animation: bloom 5s ease-in-out infinite alternate; z-index: 9999; pointer-events:none; }
        .theme-flower.left { left: 2%; transform: rotate(15deg); } .theme-flower.right { right: 2%; transform: scaleX(-1) rotate(15deg); animation-delay: 1s; }
        @keyframes bloom { 0% { transform: scale(1) rotate(10deg); } 100% { transform: scale(1.1) rotate(15deg); } }
      `;
      html = `<div class="theme-flower left">💐</div><div class="theme-flower right">💐</div>`;
    }

    style.innerHTML = css;
    document.head.appendChild(style);

    // Html elementlerini (Balon/Kandil) ekle
    if (html) {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
    }

    // Yılbaşı ise kar yağdır
    if (theme === 'yilbasi') {
      const snowContainer = document.createElement('div');
      document.body.appendChild(snowContainer);
      const count = window.innerWidth < 768 ? 15 : 35; // Mobilde kasmaması için
      for (let i = 0; i < count; i++) {
        let p = document.createElement('div'); p.className = 'snow-flake'; p.innerText = '❄';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 5 + 5) + 's';
        p.style.animationDelay = (Math.random() * 5) + 's';
        p.style.fontSize = (Math.random() * 0.8 + 0.5) + 'rem';
        p.style.opacity = Math.random() * 0.5 + 0.3;
        snowContainer.appendChild(p);
      }
    }
  }

  loadEliteTheme(); // Motoru Çalıştır
  // ==========================================

  const navbar = document.querySelector(".navbar");
  const themeToggle = document.getElementById("themeToggle");
  const homeProductGrid = document.getElementById("homeProductGrid"); 
  const allProductGrid = document.getElementById("allProductGrid");   
  const searchInput = document.getElementById("searchInput");
  const statsSection = document.querySelector("#nedenbiz");
  const counters = document.querySelectorAll(".counter");
  let allProducts = [];

  window.addEventListener("scroll", function () { navbar?.classList.toggle("scrolled", window.scrollY > 50); });

  if (themeToggle) {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode"); navbar?.classList.remove("navbar-dark"); navbar?.classList.add("navbar-light");
      themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>';
    } else { themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>'; }
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      if (document.body.classList.contains("light-mode")) {
        themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>'; navbar?.classList.remove("navbar-dark"); navbar?.classList.add("navbar-light"); localStorage.setItem("theme", "light");
      } else {
        themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>'; navbar?.classList.remove("navbar-light"); navbar?.classList.add("navbar-dark"); localStorage.setItem("theme", "dark");
      }
    });
  }

  function activateFade() {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("show"); } }); }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  }
  activateFade();

  window.addEventListener('load', () => { setTimeout(() => { const splash = document.getElementById('splashScreen'); if(splash) splash.classList.add('splash-fade'); }, 1500); });

  window.shareProduct = function(name, price, imgUrl) {
    const text = `Trend Optik'te şu modele bayıldım!\n\n🕶️ ${name}\n💰 Fiyat: ${price}\n\nSen de incele: https://www.trendoptikmersin.com/urunler`;
    if (navigator.share) { navigator.share({ title: 'Trend Optik', text: text }).catch(console.error); } 
    else { navigator.clipboard.writeText(text); alert("Ürün bilgileri kopyalandı!"); }
  };

  window.askWhatsApp = async function(id, wpLink) { window.open(wpLink, '_blank'); try { await updateDoc(doc(db, "products", id), { clicks: increment(1) }); } catch(e) { } };

  function createProductCard(product, index, isSlider = false) {
    const finalPrice = product.price.toString().includes("₺") ? product.price : `${product.price} ₺`;
    const wpMessage = `Merhaba Trend Optik! Sitenizdeki "${product.name}" modeliyle ilgileniyorum. Fiyatı: ${finalPrice}. Stokta mevcut mu?`;
    const wpLink = `https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`;
    const gridClass = isSlider ? "product-slide-item" : "col-lg-3 col-md-6 mb-4 fade-in";
    const delayStyle = isSlider ? "" : `transition-delay:${index * 0.1}s`;
    
    return `
      <div class="${gridClass}" style="${delayStyle}">
        <div class="card h-100 border-0 shadow-sm product-card">
          <div style="height:250px; overflow:hidden; position:relative;">
            <div style="background-image:url('${product.img}'); background-size:cover; background-position:center; filter:blur(20px); position:absolute; width:100%; height:100%; transform:scale(1.2); opacity:0.6;"></div>
            <img src="${product.img}" loading="lazy" style="height:250px; width:100%; object-fit:contain; position:relative; z-index:2;">
          </div>
          <div class="card-body text-center d-flex flex-column">
            <h5 class="fw-bold">${product.name}</h5>
            <p class="opacity-75 small mb-auto">${product.desc}</p>
            <p class="fw-bold accent fs-5 mt-3">${finalPrice}</p>
            <div class="d-flex justify-content-center gap-2 mt-2">
              <button onclick="askWhatsApp('${product.id}', '${wpLink}')" class="btn btn-accent rounded-pill px-3 flex-grow-1" style="white-space: nowrap; border: none; font-weight: 500;">
                <i class="bi bi-whatsapp"></i> Sor
              </button>
              <button onclick="shareProduct('${product.name}', '${finalPrice}', '${product.img}')" class="btn btn-accent rounded-pill px-3 share-btn">
                <i class="bi bi-share"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (homeProductGrid) {
    async function fetchHomeProducts() {
      homeProductGrid.innerHTML = `<div class="w-100 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
      try {
        const qs = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"), limit(6)));
        if (qs.empty) { homeProductGrid.innerHTML = `<div class="w-100 text-center"><p>Henüz ürün eklenmedi.</p></div>`; return; }
        let htmlContent = ""; let i = 0;
        qs.forEach((doc) => { htmlContent += createProductCard({ id: doc.id, ...doc.data() }, i++, true); });
        homeProductGrid.innerHTML = htmlContent + htmlContent;
      } catch (error) { homeProductGrid.innerHTML = `<p class="text-danger text-center w-100">Ürünler yüklenemedi.</p>`; }
    }
    fetchHomeProducts();
  }

  if (allProductGrid) {
    async function fetchAllProducts() {
      allProductGrid.innerHTML = `<div class="col-12 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
      try {
        const qs = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
        allProducts = []; qs.forEach((doc) => { allProducts.push({ id: doc.id, ...doc.data() }); });
        displayAllProducts(allProducts);
      } catch (error) { allProductGrid.innerHTML = `<p class="text-danger text-center">Ürünler yüklenemedi.</p>`; }
    }
    function displayAllProducts(list) {
      allProductGrid.innerHTML = "";
      if (list.length === 0) { allProductGrid.innerHTML = `<div class="col-12 text-center"><p class="opacity-75">Bu kriterlere uygun ürün bulunamadı.</p></div>`; return; }
      list.forEach((product, index) => { allProductGrid.innerHTML += createProductCard(product, index, false); });
      activateFade();
    }
    fetchAllProducts();
    if (searchInput) {
      searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        displayAllProducts(allProducts.filter(p => p.name.toLowerCase().includes(value) || p.desc.toLowerCase().includes(value)));
      });
    }
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active")); btn.classList.add("active");
        const cat = btn.dataset.category; displayAllProducts(cat === "all" ? allProducts : allProducts.filter(p => p.category === cat));
      });
    });
  }

  const heroImages = document.querySelectorAll(".hero-img");
  let current = 0;
  function updateSlider() {
    if(heroImages.length === 0) return;
    heroImages.forEach(img => img.classList.remove("active", "left", "right"));
    heroImages[current].classList.add("active");
    heroImages[(current - 1 + heroImages.length) % heroImages.length].classList.add("left");
    heroImages[(current + 1) % heroImages.length].classList.add("right");
  }
  updateSlider(); setInterval(() => { current = (current + 1) % heroImages.length; updateSlider(); }, 4000);

  if (statsSection && counters.length > 0) {
    let started = false;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        counters.forEach(counter => {
          const target = +counter.getAttribute("data-target"); let count = 0; const speed = target / 120;
          function update() { count += speed; if (count < target) { counter.innerText = Math.ceil(count); requestAnimationFrame(update); } else { counter.innerText = target; } } update();
        }); started = true;
      }
    }, { threshold: 0.5 }); observer.observe(statsSection);
  }
  
  const trackBtn = document.getElementById("trackBtn"); const trackPhone = document.getElementById("trackPhone"); const trackResult = document.getElementById("trackResult");
  if(trackBtn && trackPhone && trackResult) {
    trackBtn.addEventListener("click", async () => {
      let phoneVal = trackPhone.value.trim(); if(!phoneVal) return alert("Telefon girin!");
      trackBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`; trackBtn.disabled = true;
      try {
        const qs = await getDocs(query(collection(db, "orders"))); let foundOrder = null;
        qs.forEach((doc) => { if(doc.data().phone === phoneVal) foundOrder = doc.data(); });
        trackResult.style.display = "block";
        if(foundOrder) {
          let statusColor = "#0dcaf0"; let icon = "bi-gear-wide-connected";
          if(foundOrder.status === "Teslimata Hazır") { statusColor = "#25D366"; icon = "bi-check-circle-fill"; } else if(foundOrder.status === "Teslim Edildi") { statusColor = "#6c757d"; icon = "bi-bag-check"; } 
          trackResult.innerHTML = `<h6 class="mb-2 opacity-75">Sipariş Sahibi: <span class="text-white fw-bold">${foundOrder.customerName}</span></h6><h6 class="mb-3 opacity-75">Ürün: <span class="text-white">${foundOrder.product}</span></h6><div class="p-2 rounded d-flex align-items-center justify-content-center gap-2" style="background: rgba(255,255,255,0.05); border: 1px solid ${statusColor}; color: ${statusColor};"><i class="bi ${icon} fs-5"></i><h5 class="m-0 fw-bold">${foundOrder.status}</h5></div><p class="mt-3 mb-0 small opacity-50">Son Güncelleme: Yakın zamanda</p>`;
        } else { trackResult.innerHTML = `<div class="text-danger fw-bold">Sipariş bulunamadı.</div>`; }
      } catch (error) { trackResult.innerHTML = `<div class="text-danger fw-bold">Hata!</div>`; } finally { trackBtn.innerHTML = `Sorgula`; trackBtn.disabled = false; }
    });
  }

  if(trackPhone) {
    const trackSearchBar = document.getElementById('trackSearchBar');
    if (trackSearchBar) {
        trackPhone.addEventListener('focus', () => trackSearchBar.classList.add('is-focused') );
        trackPhone.addEventListener('blur', () => trackSearchBar.classList.remove('is-focused') );
    }
  }
});

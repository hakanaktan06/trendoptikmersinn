// Firebase v12.10.0 Importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, updateDoc, doc, increment, getDoc, where } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", async function () {

  // ==========================================
  // BUKALEMUN TEMA MOTORU
  // ==========================================
  let currentTheme = 'standart';
  
  const themeData = {
    'standart': { 
        color: '#f5a623', 
        wpBtn: '<i class="bi bi-whatsapp"></i> Sor', 
        wpMsg: 'Merhaba Trend Optik! Sitenizdeki', 
        ribbon: '' 
    },
    'yilbasi': { 
        color: '#00b4d8', 
        wpBtn: '<i class="bi bi-gift-fill"></i> Yeni Yıl Hediyesi', 
        wpMsg: 'Trend Optik, yeni yıl hediyesi olarak sitemizdeki', 
        ribbon: '<div class="theme-ribbon bg-info">❄️ Yılbaşı Fırsatı</div>' 
    },
    'sevgililer': { 
        color: '#ff3366', 
        wpBtn: '<i class="bi bi-suit-heart-fill"></i> Sevgilime Alacağım', 
        wpMsg: 'Trend Optik, Sevgililer Günü hediyesi olarak', 
        ribbon: '<div class="theme-ribbon" style="background:#ff3366;">❤️ Aşkla Tasarlandı</div>' 
    },
    'kadinlar': { 
        color: '#d05ce3', 
        wpBtn: '<i class="bi bi-flower1"></i> Anneme/Eşime Hediye', 
        wpMsg: 'Trend Optik, Kadınlar Günü hediyesi olarak', 
        ribbon: '<div class="theme-ribbon" style="background:#d05ce3;">💜 Özel Koleksiyon</div>' 
    },
    'bayram': { 
        color: '#d4af37', 
        wpBtn: '<i class="bi bi-moon-stars-fill"></i> Bayramlık', 
        wpMsg: 'Trend Optik, Bayram için sitemizdeki', 
        ribbon: '<div class="theme-ribbon" style="background:#d4af37; color:#000;">🌙 Bayram Fırsatı</div>' 
    }
  };

  function applyColorEngine(color) {
    const style = document.createElement('style');
    style.innerHTML = `
      :root { --theme-color: ${color}; }
      .accent { color: var(--theme-color) !important; }
      .btn-accent { 
          background-color: var(--theme-color) !important; 
          color: ${color === '#d4af37' ? '#000' : '#fff'} !important; 
          border: none !important; 
          transition: 0.3s; 
      }
      .btn-accent:hover { 
          filter: brightness(1.15); 
          transform: translateY(-3px); 
          box-shadow: 0 5px 15px ${color}66; 
      }
      .product-card { 
          transition: 0.4s; 
          overflow: visible !important; 
      }
      .product-card:hover { 
          border-color: var(--theme-color) !important; 
          box-shadow: 0 10px 30px ${color}22 !important; 
      }
      .theme-ribbon { 
          position: absolute; 
          top: 15px; 
          left: -10px; 
          padding: 6px 15px; 
          font-size: 0.75rem; 
          font-weight: 800; 
          border-radius: 0 10px 10px 0; 
          z-index: 10; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.4); 
          color: #fff; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
      }
      .theme-ribbon::before { 
          content: ''; 
          position: absolute; 
          bottom: -10px; 
          left: 0; 
          border-top: 10px solid rgba(0,0,0,0.6); 
          border-left: 10px solid transparent; 
      }

      /* ========================================= */
      /* YENİ: KUSURSUZ CANLI ARAMA (BALYOZ EFEKTİ) */
      /* ========================================= */
      
      #search-spotlight-overlay { 
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
          background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); 
          z-index: 99990; opacity: 0; pointer-events: none; transition: 0.3s; 
      }
      #search-spotlight-overlay.active { opacity: 1; pointer-events: all; }
      
      .spotlight-elevated {
          position: relative !important;
          z-index: 99995 !important;
      }
      
      .live-search-dropdown {
          position: absolute; 
          background: #0a0a0c; 
          border: 2px solid var(--theme-color);
          border-radius: 12px;
          box-shadow: 0 25px 60px rgba(0,0,0,1);
          max-height: 400px;
          overflow-y: auto;
          z-index: 999999 !important; /* DÜNYANIN EN ÜST KATMANI */
          display: none;
          flex-direction: column;
      }
      .live-search-dropdown::-webkit-scrollbar { width: 6px; }
      .live-search-dropdown::-webkit-scrollbar-thumb { background: var(--theme-color); border-radius: 10px; }
      .live-search-dropdown.show { display: flex; animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      
      .live-search-item {
          display: flex; align-items: center; padding: 15px; 
          border-bottom: 1px solid rgba(255,255,255,0.05); 
          transition: 0.3s; gap: 15px; color: #fff; text-decoration: none; cursor: pointer;
      }
      .live-search-item:last-child { border-bottom: none; }
      .live-search-item:hover { background: rgba(255,255,255,0.08); padding-left: 20px; }
      .live-search-img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background:#111; }
      .live-search-info { flex-grow: 1; }
      .live-search-title { font-weight: 700; font-size: 1rem; margin: 0 0 5px 0; }
      .live-search-price { color: var(--theme-color); font-weight: 800; font-size: 0.9rem; margin: 0; }
      .live-search-action .btn { font-size: 0.85rem; padding: 8px 16px; border-radius: 30px; pointer-events: none; background: var(--theme-color); color:#000; font-weight:bold; }
    `;
    document.head.appendChild(style);
  }

             function applyVisualEffects(theme) {
    // 1. Önceki tüm hatalı/eski süsleri ve sarmalayıcıları (wrapper) temizle
    document.querySelectorAll('.trend-theme-decor').forEach(el => el.remove());
    const oldStyle = document.getElementById("trend-theme-style");
    if (oldStyle) oldStyle.remove();

    // Sitedeki TÜM "Trend Optik" yazılarını bulalım (Açılış ekranı VE Ana sayfa)
    let heroTitles = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5')).filter(el => 
        el.innerHTML.includes('Trend Optik') && !el.classList.contains('navbar-brand')
    );
    
    // Sitedeki "Randevu" butonunu bulalım
    let randevuBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
        el.innerText.toLowerCase().includes('randevu')
    );

    // Temizleme işlemi (Tüm başlıkları orijinaline döndür)
    heroTitles.forEach(title => {
        if (title.dataset.originalHtml) {
            title.innerHTML = title.dataset.originalHtml;
        }
    });

    if (!theme || theme === 'standart') {
        document.body.style.backgroundColor = ""; 
        return;
    }

    // 2. Özel Vektörel Çizimler (Sadece Lüks Line-Art SVG)
    let logoReplacement = "";
    let buttonSideDecor = "";

    if (theme === "yilbasi") {
        logoReplacement = '<span class="custom-letter">T<svg class="decor-svg hat-svg" viewBox="0 0 24 24"><path fill="none" stroke="#00b4d8" stroke-width="1.5" d="M12 2L12 6M12 22L12 18M2 12L6 12M22 12L18 12M4.9 4.9L7.7 7.7M19.1 19.1L16.3 16.3M4.9 19.1L7.7 16.3M19.1 4.9L16.3 7.7"/></svg></span>rend Optik';
        buttonSideDecor = `<svg class="btn-side-svg" viewBox="0 0 24 24"><path fill="none" stroke="#00b4d8" stroke-width="1.5" d="M20 12v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9m16 0H4m16 0V7a1 1 0 00-1-1H5a1 1 0 00-1 1v5m4-5V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h4"/></svg><span class="btn-side-text" style="color:#00b4d8">Yeni Yıl Hediyesi</span>`;
    } else if (theme === "sevgililer") {
        logoReplacement = 'Trend Opt<span class="custom-letter">ı<svg class="decor-svg heart-dot" viewBox="0 0 24 24"><path fill="#ff3366" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>k';
        buttonSideDecor = `<svg class="btn-side-svg" viewBox="0 0 24 24"><path fill="none" stroke="#ff3366" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><span class="btn-side-text" style="color:#ff3366">Sevgiyle...</span>`;
    } else if (theme === "kadinlar") {
        logoReplacement = 'Tr<span class="custom-letter">e<svg class="decor-svg flower-svg" viewBox="0 0 24 24"><path fill="none" stroke="#d05ce3" stroke-width="1.5" stroke-linecap="round" d="M12 22V12M12 12C12 12 7 8 7 4C7 4 12 2 12 7C12 2 17 4 17 4C17 8 12 12 12 12Z"/></svg></span>nd Optik';
        buttonSideDecor = `<svg class="btn-side-svg" viewBox="0 0 24 24"><path fill="none" stroke="#d05ce3" stroke-width="1.5" stroke-linecap="round" d="M12 21.5c-3-3-6-6-6-10a6 6 0 1112 0c0 4-3 7-6 10zM12 15a3 3 0 100-6 3 3 0 000 6z"/></svg><span class="btn-side-text" style="color:#d05ce3">Özel Koleksiyon</span>`;
    } else if (theme === "bayram") {
        logoReplacement = 'Trend <span class="custom-letter">O<svg class="decor-svg crescent-inner" viewBox="0 0 24 24"><path fill="#d4af37" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>ptik';
        buttonSideDecor = `<svg class="btn-side-svg" viewBox="0 0 24 24"><path fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M8 10V7a4 4 0 118 0v3m-9 0h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2zM10 14a2 2 0 104 0 2 2 0 00-4 0z"/></svg><span class="btn-side-text" style="color:#d4af37">İyi Bayramlar</span>`;
    }

    // 3. Jilet Gibi Keskin CSS Ayarları
    const style = document.createElement("style");
    style.id = "trend-theme-style";
    style.innerHTML = `
        .custom-letter { position: relative; display: inline-block; }
        .decor-svg { position: absolute; pointer-events: none; }
        
        .heart-dot { width: 0.4em; height: 0.4em; top: -0.2em; left: 50%; transform: translateX(-50%); filter: drop-shadow(0 2px 5px rgba(255,51,102,0.6)); animation: softPulse 3s infinite alternate; }
        .crescent-inner { width: 0.45em; height: 0.45em; top: 50%; left: 50%; transform: translate(-50%, -50%); filter: drop-shadow(0 0 8px rgba(212,175,55,0.7)); }
        .hat-svg { width: 0.6em; height: 0.6em; top: -0.4em; left: -0.2em; filter: drop-shadow(0 0 5px rgba(0,180,216,0.5)); }
        .flower-svg { width: 0.5em; height: 0.5em; top: -0.3em; right: -0.3em; filter: drop-shadow(0 0 5px rgba(208,92,227,0.5)); }

        @keyframes softPulse { 0% { transform: translateX(-50%) scale(0.95); opacity: 0.8; } 100% { transform: translateX(-50%) scale(1.1); opacity: 1; } }

        /* BUTON VE SÜSÜ YAN YANA KİLİTLEYEN DÜZENEK (Wrapper) */
        .trend-btn-wrapper {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center;
            gap: 12px !important;
            flex-wrap: nowrap; /* Asla alt satıra atma */
            margin-top: 10px;
        }

        .trend-side-decor-container {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(255,255,255,0.05); /* Lüks hap (pill) görünümü */
            border-radius: 50px;
            border: 1px solid rgba(255,255,255,0.1);
            animation: fadeIn 0.5s ease forwards;
            white-space: nowrap; /* Metin asla iki satıra bölünmesin */
            backdrop-filter: blur(5px);
        }
        .light-mode .trend-side-decor-container {
            background: rgba(0,0,0,0.03);
            border: 1px solid rgba(0,0,0,0.05);
        }
        .btn-side-svg { width: 24px; height: 24px; }
        .btn-side-text { font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    `;
    document.head.appendChild(style);

    // 4. Bütün "Trend Optik" Başlıklarına Şovu Uygula
    heroTitles.forEach(title => {
        if (!title.dataset.originalHtml) {
            title.dataset.originalHtml = title.innerHTML; // Orijinali yedekle
        }
        // Eğer HTML içinde "Trend Optik" geçiyorsa, tam o kısmı değiştir
        title.innerHTML = title.innerHTML.replace('Trend Optik', logoReplacement);
    });

    // 5. Randevu Butonunun Yanına KİLİTLEMELİ Şekilde Rozeti Ekle
    if (randevuBtn) {
        // Eğer daha önce wrapper (kilit sarmalayıcı) oluşturmadıysak oluşturalım
        let wrapper = randevuBtn.closest('.trend-btn-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'trend-btn-wrapper trend-theme-decor'; // Temizlenmesi için class verdik
            randevuBtn.parentNode.insertBefore(wrapper, randevuBtn);
            wrapper.appendChild(randevuBtn); // Butonu içine aldık
        }
        
        // Şimdi rozeti butonun hemen yanına, KUTUNUN İÇİNE ekliyoruz (Asla alta düşmez)
        const sideDecor = document.createElement("div");
        sideDecor.className = "trend-side-decor-container trend-theme-decor";
        sideDecor.innerHTML = buttonSideDecor;
        
        wrapper.appendChild(sideDecor);
    }
  }




  // 3. SİSTEM BAŞLATICI
  async function initializeSystem() {
    try {
      const snap = await getDoc(doc(db, "settings", "theme"));
      if (snap.exists() && snap.data().activeTheme) {
        currentTheme = snap.data().activeTheme;
      }
    } catch (e) { 
      console.log("Tema verisi çekilemedi."); 
    }

    const tData = themeData[currentTheme];
    
    if (currentTheme !== 'standart') {
      applyColorEngine(tData.color);
      applyVisualEffects(currentTheme);
    } else {
      applyColorEngine(tData.color);
    }

    if (document.getElementById("homeProductGrid")) fetchHomeProducts();
    if (document.getElementById("allProductGrid")) fetchAllProducts();
  }

  initializeSystem();

  // ==========================================
  // STANDART SİTE FONKSİYONLARI 
  // ==========================================
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.getElementById("themeToggle");
  const homeProductGrid = document.getElementById("homeProductGrid"); 
  const allProductGrid = document.getElementById("allProductGrid");   
  const searchInput = document.getElementById("searchInput");
  const statsSection = document.querySelector("#nedenbiz");
  const counters = document.querySelectorAll(".counter");
  let allProducts = [];

  window.addEventListener("scroll", function () { 
      navbar?.classList.toggle("scrolled", window.scrollY > 50); 
  });

  if (themeToggle) {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode"); 
      navbar?.classList.remove("navbar-dark"); 
      navbar?.classList.add("navbar-light");
      themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>';
    } else { 
        themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>'; 
    }
    
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      if (document.body.classList.contains("light-mode")) {
        themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>'; 
        navbar?.classList.remove("navbar-dark"); 
        navbar?.classList.add("navbar-light"); 
        localStorage.setItem("theme", "light");
      } else {
        themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>'; 
        navbar?.classList.remove("navbar-light"); 
        navbar?.classList.add("navbar-dark"); 
        localStorage.setItem("theme", "dark");
      }
    });
  }

  function activateFade() {
    const observer = new IntersectionObserver(entries => { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                entry.target.classList.add("show"); 
            } 
        }); 
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  }
  activateFade();

  window.addEventListener('load', () => { 
      setTimeout(() => { 
          const splash = document.getElementById('splashScreen'); 
          if(splash) splash.classList.add('splash-fade'); 
      }, 1500); 
  });

  window.shareProduct = function(name, price, imgUrl) {
    const text = `Trend Optik'te şu modele bayıldım!\n\n🕶️ ${name}\n💰 Fiyat: ${price}\n\nSen de incele: https://www.trendoptikmersin.com/urunler`;
    if (navigator.share) { 
        navigator.share({ title: 'Trend Optik', text: text }).catch(console.error); 
    } else { 
        navigator.clipboard.writeText(text); 
        alert("Ürün bilgileri kopyalandı!"); 
    }
  };

  window.askWhatsApp = async function(id, wpLink) { 
      window.open(wpLink, '_blank'); 
      try { 
          await updateDoc(doc(db, "products", id), { clicks: increment(1) }); 
      } catch(e) { } 
  };

  function createProductCard(product, index, isSlider = false) {
    const finalPrice = product.price.toString().includes("₺") ? product.price : `${product.price} ₺`;
    const t = themeData[currentTheme]; 
    
    const wpMessage = `${t.wpMsg} "${product.name}" modeliyle ilgileniyorum. Fiyatı: ${finalPrice}. Stokta mevcut mu?`;
    const wpLink = `https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`;
    
    const gridClass = isSlider ? "product-slide-item" : "col-lg-3 col-md-6 mb-4 fade-in";
    const delayStyle = isSlider ? "" : `transition-delay:${index * 0.1}s`;
    
    return `
      <div class="${gridClass}" style="${delayStyle}">
        <div class="card h-100 border-0 shadow-sm product-card position-relative">
          ${t.ribbon}
          <div style="height:250px; overflow:hidden; position:relative; cursor:pointer;" onclick="window.location.href='urun-detay.html?id=${product.id}'">
  <div style="background-image:url('${product.img}'); background-size:cover; background-position:center; filter:blur(20px); position:absolute; width:100%; height:100%; transform:scale(1.2); opacity:0.6;"></div>
  <img src="${product.img}" loading="lazy" style="height:250px; width:100%; object-fit:contain; position:relative; z-index:2;">
</div>

          <div class="card-body text-center d-flex flex-column">
            <h5 class="fw-bold">${product.name}</h5>
            <p class="opacity-75 small mb-auto">${product.desc}</p>
            <p class="fw-bold accent fs-5 mt-3">${finalPrice}</p>
            <div class="d-flex justify-content-center gap-2 mt-2">
              <button onclick="askWhatsApp('${product.id}', '${wpLink}')" class="btn btn-accent rounded-pill px-3 flex-grow-1" style="white-space: nowrap; font-weight: 600;">
                ${t.wpBtn}
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

  // YILDIZLI ÜRÜNLERİ ANA SAYFAYA ÇEKME
  async function fetchHomeProducts() {
    homeProductGrid.innerHTML = `<div class="w-100 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
    try {
      const q = query(collection(db, "products"), where("isFeatured", "==", true));
      let querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) { 
          const fallbackQ = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(6));
          querySnapshot = await getDocs(fallbackQ);
      }

      if (querySnapshot.empty) {
        homeProductGrid.innerHTML = `<div class="w-100 text-center"><p>Henüz ürün eklenmedi.</p></div>`; 
        return; 
      }

      let htmlContent = ""; 
      let i = 0;
      querySnapshot.forEach((doc) => { 
          htmlContent += createProductCard({ id: doc.id, ...doc.data() }, i++, true); 
      });
      homeProductGrid.innerHTML = htmlContent + htmlContent;

    } catch (error) { 
        homeProductGrid.innerHTML = `<p class="text-danger text-center w-100">Ürünler yüklenemedi.</p>`; 
    }
  }

  async function fetchAllProducts() {
    allProductGrid.innerHTML = `<div class="col-12 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
    try {
      const qs = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
      allProducts = []; 
      qs.forEach((doc) => { 
          allProducts.push({ id: doc.id, ...doc.data() }); 
      });
      displayAllProducts(allProducts);
    } catch (error) { 
        allProductGrid.innerHTML = `<p class="text-danger text-center">Ürünler yüklenemedi.</p>`; 
    }
  }

  function displayAllProducts(list) {
    allProductGrid.innerHTML = "";
    if (list.length === 0) { 
        allProductGrid.innerHTML = `<div class="col-12 text-center"><p class="opacity-75">Bu kriterlere uygun ürün bulunamadı.</p></div>`; 
        return; 
    }
    list.forEach((product, index) => { 
        allProductGrid.innerHTML += createProductCard(product, index, false); 
    });
    activateFade();
  }

  // ==========================================
  // YENİ: VAHŞET CANLI AKILLI ARAMA (BALYOZ KURALI: ASLA KÖR OLMAZ)
  // ==========================================
  if (searchInput) {
    
    // 1. Karartma Perdesini direkt BODY'e ekliyoruz ki tüm ekranı kapatsın
    const overlay = document.createElement('div');
    overlay.id = 'search-spotlight-overlay';
    document.body.appendChild(overlay);

    // 2. Dropdown Menüyü de BODY'e bağlıyoruz ki Filtreleri Ezip Geçsin
    const dropdown = document.createElement('div');
    dropdown.className = 'live-search-dropdown';
    document.body.appendChild(dropdown);

    // Balyoz Algoritması: Arama kutusunu ezen ebeveynleri (parent) bul ve yukarı çıkar!
    function elevateParents(el) {
        let current = el;
        // DÜZELTME BURADA: 'SECTION' etiketine kadar çıkmasını söylüyoruz. 
        // Tüm section'ı yükseltirsen z-index savaşı başlar ve input kararıp kör olur.
        while (current && current.tagName !== 'SECTION' && current !== document.body && current !== document.documentElement) {
            if (window.getComputedStyle(current).position === 'static') {
                current.style.setProperty('position', 'relative', 'important');
            }
            // Z-index'i doğrudan inline çakıyoruz ki her halükarda ezip geçsin
            current.style.setProperty('z-index', '999995', 'important'); 
            current.classList.add('spotlight-elevated');
            current = current.parentElement;
        }
    }

    function restoreParents() {
        document.querySelectorAll('.spotlight-elevated').forEach(el => {
            el.classList.remove('spotlight-elevated');
            // Aramadan çıkınca zırhları tam çıkartıyoruz (inline stilleri temizliyoruz)
            el.style.removeProperty('z-index');
            el.style.removeProperty('position');
        });
    }


    function positionDropdown() {
        const rect = searchInput.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        dropdown.style.left = (rect.left + window.scrollX) + 'px';
        dropdown.style.width = rect.width + 'px';
    }

    // Arama Odaklanınca Çalışacak Şov
    function openSpotlight() {
        overlay.classList.add('active');
        
        // Zırh giydirme işlemi (O kutunun karanlıkta kalması artık FİZİKEN İMKANSIZ)
        elevateParents(searchInput);
        
        searchInput.style.setProperty('position', 'relative', 'important');
        searchInput.style.setProperty('z-index', '999999', 'important');
        searchInput.style.setProperty('background-color', '#fff', 'important');
        searchInput.style.setProperty('color', '#000', 'important');
    }

    // Aramadan Çıkınca Her Şeyi Eski Haline Döndür
    function closeSearch() {
        dropdown.classList.remove('show');
        overlay.classList.remove('active');
        
        // Zırhları Çıkar
        searchInput.style.zIndex = '';
        searchInput.style.position = '';
        searchInput.style.backgroundColor = '';
        searchInput.style.color = '';
        
        restoreParents();
        searchInput.value = ''; 
        displayAllProducts(allProducts); 
    }

    searchInput.addEventListener("input", function () {
        positionDropdown();
        const value = this.value.toLowerCase().trim();
        dropdown.innerHTML = ''; 
        
        // Kutu boşsa menüyü kapat ama arkaplanı geri getirme, adam hala yazabilir
        if (value.length === 0) {
            dropdown.classList.remove('show');
            return;
        }

        openSpotlight();

        // SADECE dropdown içinde filtrele. Arka plandaki grid DEĞİŞMEZ!
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(value) || p.desc.toLowerCase().includes(value));

        if (filtered.length > 0) {
            filtered.forEach(product => {
                const finalPrice = product.price.toString().includes("₺") ? product.price : `${product.price} ₺`;
                const t = themeData[currentTheme] || themeData['standart'];
                const wpMessage = `${t.wpMsg} "${product.name}" modeliyle ilgileniyorum. Fiyatı: ${finalPrice}. Stokta mevcut mu?`;
                const wpLink = `https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`;

                const item = document.createElement('div');
item.className = 'live-search-item';
// SATIRA TIKLAYINCA DETAYA GİDER!
item.onclick = function(e) { 
    window.location.href = `urun-detay.html?id=${product.id}`; 
};


                item.innerHTML = `
                    <img src="${product.img}" class="live-search-img">
                    <div class="live-search-info">
                        <p class="live-search-title">${product.name}</p>
                        <p class="live-search-price">${finalPrice}</p>
                    </div>
                    <div class="live-search-action">
                        <button class="btn btn-accent fw-bold" onclick="window.askWhatsApp('${product.id}', '${wpLink}'); event.stopPropagation();">${t.wpBtn}</button>
                    </div>
                `;
                dropdown.appendChild(item);
            });
            dropdown.classList.add('show');
        } else {
            dropdown.innerHTML = `<div class="p-4 text-center opacity-50 fw-bold" style="color:#fff;">Aradığınız gözlük bulunamadı...</div>`;
            dropdown.classList.add('show');
        }
    });

    searchInput.addEventListener('focus', () => {
        openSpotlight();
        if(searchInput.value.trim().length > 0) {
            dropdown.classList.add('show');
        }
    });

    window.addEventListener('resize', () => { 
        if(dropdown.classList.contains('show')) positionDropdown(); 
    });
    
    window.addEventListener('scroll', () => { 
        if(dropdown.classList.contains('show')) positionDropdown(); 
    });

    // Boşluğa (Perdeye) Tıklayınca Aramayı Kapat
    overlay.addEventListener('click', closeSearch);
  }

  // ==========================================
  // FİLTRELER VE DİĞER FONKSİYONLAR
  // ==========================================
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active")); 
        btn.classList.add("active");
        const cat = btn.dataset.category; 
        displayAllProducts(cat === "all" ? allProducts : allProducts.filter(p => p.category === cat));
    });
  });

  const heroImages = document.querySelectorAll(".hero-img");
  let current = 0;
  
  function updateSlider() {
      if(heroImages.length === 0) return;
      heroImages.forEach(img => img.classList.remove("active", "left", "right"));
      heroImages[current].classList.add("active");
      heroImages[(current - 1 + heroImages.length) % heroImages.length].classList.add("left");
      heroImages[(current + 1) % heroImages.length].classList.add("right");
  }
  
  updateSlider(); 
  
  setInterval(() => { 
      current = (current + 1) % heroImages.length; 
      updateSlider(); 
  }, 4000);

  if (statsSection && counters.length > 0) {
      let started = false;
      const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && !started) {
              counters.forEach(counter => {
                  const target = +counter.getAttribute("data-target"); 
                  let count = 0; 
                  const speed = target / 120;
                  
                  function update() { 
                      count += speed; 
                      if (count < target) { 
                          counter.innerText = Math.ceil(count); 
                          requestAnimationFrame(update); 
                      } else { 
                          counter.innerText = target; 
                      } 
                  } 
                  update();
              }); 
              started = true;
          }
      }, { threshold: 0.5 }); 
      observer.observe(statsSection);
  }
  
  const trackBtn = document.getElementById("trackBtn"); 
  const trackPhone = document.getElementById("trackPhone"); 
  const trackResult = document.getElementById("trackResult");
  
  if(trackBtn && trackPhone && trackResult) {
      trackBtn.addEventListener("click", async () => {
          let phoneVal = trackPhone.value.trim(); 
          if(!phoneVal) return alert("Telefon girin!");
          
          trackBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`; 
          trackBtn.disabled = true;
          
          try {
              const qs = await getDocs(query(collection(db, "orders"))); 
              let foundOrder = null;
              
              qs.forEach((doc) => { 
                  if(doc.data().phone === phoneVal) {
                      foundOrder = doc.data(); 
                    }
              });
              
              trackResult.style.display = "block";
              
              if(foundOrder) {
                  let statusColor = "#0dcaf0"; 
                  let icon = "bi-gear-wide-connected";
                  
                  if(foundOrder.status === "Teslimata Hazır") { 
                      statusColor = "#25D366"; 
                      icon = "bi-check-circle-fill"; 
                  } else if(foundOrder.status === "Teslim Edildi") { 
                      statusColor = "#6c757d"; 
                      icon = "bi-bag-check"; 
                  } 
                  
                  trackResult.innerHTML = `
                      <h6 class="mb-2 opacity-75">Sipariş Sahibi: <span class="text-white fw-bold">${foundOrder.customerName}</span></h6>
                      <h6 class="mb-3 opacity-75">Ürün: <span class="text-white">${foundOrder.product}</span></h6>
                      <div class="p-2 rounded d-flex align-items-center justify-content-center gap-2" style="background: rgba(255,255,255,0.05); border: 1px solid ${statusColor}; color: ${statusColor};">
                          <i class="bi ${icon} fs-5"></i>
                          <h5 class="m-0 fw-bold">${foundOrder.status}</h5>
                      </div>
                      <p class="mt-3 mb-0 small opacity-50">Son Güncelleme: Yakın zamanda</p>
                  `;
              } else { 
                  trackResult.innerHTML = `<div class="text-danger fw-bold"><i class="bi bi-exclamation-triangle"></i> Sipariş bulunamadı.</div>`; 
              }
          } catch (error) { 
              trackResult.innerHTML = `<div class="text-danger fw-bold">Hata!</div>`; 
          } finally { 
              trackBtn.innerHTML = `Sorgula`; 
              trackBtn.disabled = false; 
          }
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

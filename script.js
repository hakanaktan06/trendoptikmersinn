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
    // 1. Varsa eski efekti temizle
    const oldContainer = document.getElementById("trend-theme-container");
    if (oldContainer) oldContainer.remove();

    if (theme === 'standart') return;

    // 2. Yeni Kapsayıcı (Z-INDEX -1 İLE EN ARKAYA ATIYORUZ)
    const container = document.createElement("div");
    container.id = "trend-theme-container";
    container.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: -1; overflow: hidden;";

    // Animasyon CSS Kodları
    if (!document.getElementById("trend-theme-anim")) {
        const style = document.createElement("style");
        style.id = "trend-theme-anim";
        style.innerHTML = `
            @keyframes fallAndSway {
                0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
                10% { opacity: 0.6; }
                50% { transform: translateY(50vh) translateX(20px) rotate(180deg); }
                90% { opacity: 0.6; }
                100% { transform: translateY(110vh) translateX(-20px) rotate(360deg); opacity: 0; }
            }
            @keyframes swingLantern {
                0% { transform: rotate(6deg); }
                100% { transform: rotate(-6deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // 3. Temalara Göre Simgeleri Belirle
    let symbols = [];
    let isLantern = false;

    if (theme === "yilbasi") {
        symbols = ["❄", "❅", "❆"];
    } else if (theme === "sevgililer") {
        symbols = ["❤️", "💖", "💕"];
    } else if (theme === "kadinlar") {
        symbols = ["🌸", "🌺", "🌼", "✨"]; 
    } else if (theme === "bayram") {
        isLantern = true; 
    }

    // 4. Ekrana Parçacıkları Yağdır
    if (!isLantern) {
        const particleCount = 25; 
        for (let i = 0; i < particleCount; i++) {
            let particle = document.createElement("div");
            particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.position = "absolute";
            particle.style.left = Math.random() * 100 + "vw";
            particle.style.top = "-5vh";
            
            particle.style.fontSize = (Math.random() * 1.5 + 1) + "rem";
            particle.style.opacity = Math.random() * 0.4 + 0.2; 
            
            const duration = Math.random() * 6 + 6; 
            const delay = Math.random() * 5; 
            
            // Ters tırnak (backtick) hatası çözüldü
            particle.style.animation = "fallAndSway " + duration + "s linear " + delay + "s infinite";
            
            container.appendChild(particle);
        }
    } else {
        // Bayram Fenerleri
        container.style.position = 'absolute'; 
        container.style.height = '400px'; 
        container.innerHTML = `
          <style>
          .lantern { width: 30px; height: 50px; background: linear-gradient(to bottom, rgba(245,166,35,0.8), rgba(212,175,55,0.8)); border-radius: 15px 15px 5px 5px; position: absolute; top: 40px; animation: swingLantern 4s ease-in-out infinite alternate; transform-origin: top center; box-shadow: 0 10px 20px rgba(245,166,35,0.3); } 
          .lantern::before { content: ''; position: absolute; top: -40px; left: 14px; width: 1px; height: 40px; background: rgba(255,255,255,0.2); } 
          .lantern::after { content: ''; position: absolute; bottom: -10px; left: 10px; width: 10px; height: 10px; background: rgba(245,166,35,0.8); clip-path: polygon(0 0, 100% 0, 50% 100%); }
          </style>
          <div class="lantern" style="left: 10%; animation-delay: 0s;"></div>
          <div class="lantern" style="right: 10%; animation-delay: 1s;"></div>
        `;
    }

    document.body.appendChild(container);
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

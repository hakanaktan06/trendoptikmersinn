// Firebase v12.10.0 Importları (getDoc ve setDoc eklendi)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, updateDoc, doc, increment, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
  // TRENDYOL/AMAZON SEVİYESİ ELİT TEMA MOTORU
  // ==========================================
  async function loadEliteTheme() {
    try {
      const snap = await getDoc(doc(db, "settings", "theme"));
      if (snap.exists() && snap.data().activeTheme && snap.data().activeTheme !== "standart") {
        applyProfessionalTheme(snap.data().activeTheme);
      }
    } catch (e) { console.log("Tema yüklenemedi", e); }
  }

  function applyProfessionalTheme(theme) {
    const style = document.createElement('style');
    let css = '';
    let container = document.createElement('div');
    container.id = 'elite-theme-container';
    // Site kullanımını ASLA engellememesi için pointer-events: none ÇOK ÖNEMLİ
    container.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100vh; overflow: hidden; pointer-events: none; z-index: 9999;';

    if (theme === 'yilbasi') {
      // KAR YAĞIŞI VE ZARİF KAR BİRİKİNTİSİ (Kalın kaba şerit yerine, buzlanma efekti)
      css = `
        /* Logo üzerinde zarif incecik kar detayı */
        .navbar-brand { position: relative; }
        .navbar-brand::after { content: ''; position: absolute; top: -3px; left: -2%; width: 104%; height: 5px; background: rgba(255,255,255,0.9); border-radius: 10px; filter: blur(1px); }
        /* Ürün kartlarında ince, buzlu bir dokunuş (Kaba beyaz kutu değil) */
        .product-card { border-top: 1px solid rgba(255,255,255,0.8) !important; box-shadow: 0 -4px 10px rgba(255,255,255,0.1) !important; }
        /* Kusursuz CSS Kar Taneleri (Emoji Değil) */
        .snowflake { position: absolute; background: white; border-radius: 50%; filter: blur(1px); animation: snowFall linear infinite; }
        @keyframes snowFall { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(100vh); opacity: 0; } }
      `;
      // Karı sayfada sabit tutuyoruz
      container.style.position = 'fixed';
      for(let i=0; i<40; i++) {
        let size = Math.random() * 4 + 2; let left = Math.random() * 100; let dur = Math.random() * 5 + 5; let del = Math.random() * 5;
        container.innerHTML += `<div class="snowflake" style="width:${size}px;height:${size}px;left:${left}%;animation-duration:${dur}s;animation-delay:${del}s;"></div>`;
      }
    } 
    else if (theme === 'sevgililer') {
      // ZARİF CSS KALPLER (Emoji Değil)
      css = `
        .css-heart { position: absolute; width: 12px; height: 12px; background: rgba(255, 51, 102, 0.5); transform: rotate(-45deg); animation: floatHeart linear infinite; filter: drop-shadow(0 0 5px rgba(255,51,102,0.4)); }
        .css-heart::before, .css-heart::after { content: ""; position: absolute; width: 12px; height: 12px; background: inherit; border-radius: 50%; }
        .css-heart::before { top: -6px; left: 0; } .css-heart::after { top: 0; left: 6px; }
        @keyframes floatHeart { 0% { transform: translateY(100vh) rotate(-45deg) scale(0.5); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(-10vh) rotate(-45deg) scale(1.2); opacity: 0; } }
        .product-card { border-color: rgba(255,51,102,0.2) !important; }
      `;
      container.style.position = 'fixed';
      for(let i=0; i<25; i++) {
        let left = Math.random() * 100; let dur = Math.random() * 6 + 4; let del = Math.random() * 5;
        container.innerHTML += `<div class="css-heart" style="left:${left}%;animation-duration:${dur}s;animation-delay:${del}s;"></div>`;
      }
    }
    else if (theme === 'kadinlar') {
      // KADINLAR GÜNÜ (Zarif Mor Taç Yaprakları Süzülür)
      css = `
        .petal { position: absolute; width: 10px; height: 10px; background: linear-gradient(135deg, #d05ce3, #9c27b0); border-radius: 0 10px 0 10px; animation: fallPetal linear infinite; filter: drop-shadow(0 0 3px rgba(208,92,227,0.4)); opacity: 0.6; }
        @keyframes fallPetal { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
        .accent { color: #d05ce3 !important; } .btn-accent { background: #d05ce3 !important; color: white !important; }
        .product-card { border-color: rgba(156,39,176,0.2) !important; }
      `;
      container.style.position = 'fixed';
      for(let i=0; i<30; i++) {
        let left = Math.random() * 100; let dur = Math.random() * 6 + 5; let del = Math.random() * 5;
        container.innerHTML += `<div class="petal" style="left:${left}%;animation-duration:${dur}s;animation-delay:${del}s;"></div>`;
      }
    }
    else if (theme === 'bayram') {
      // BAYRAM (Sayfa başında sabit kalan sarkan zarif kandiller. Aşağı inince ekranı kapatmaz)
      container.style.position = 'absolute'; // Mutlak, yani aşağı kayınca üstte kalır
      container.style.height = '400px'; 
      css = `
        .lantern { width: 30px; height: 50px; background: linear-gradient(to bottom, rgba(245,166,35,0.8), rgba(212,175,55,0.8)); border-radius: 15px 15px 5px 5px; position: absolute; top: 40px; animation: swing 4s ease-in-out infinite alternate; transform-origin: top center; box-shadow: 0 10px 20px rgba(245,166,35,0.3); }
        .lantern::before { content: ''; position: absolute; top: -40px; left: 14px; width: 1px; height: 40px; background: rgba(255,255,255,0.2); }
        .lantern::after { content: ''; position: absolute; bottom: -10px; left: 10px; width: 10px; height: 10px; background: rgba(245,166,35,0.8); clip-path: polygon(0 0, 100% 0, 50% 100%); }
        @keyframes swing { 0% { transform: rotate(6deg); } 100% { transform: rotate(-6deg); } }
        .product-card { border-color: rgba(245,166,35,0.2) !important; }
      `;
      container.innerHTML = `
        <div class="lantern" style="left: 10%; animation-delay: 0s;"></div>
        <div class="lantern" style="right: 10%; animation-delay: 1s;"></div>
      `;
    }

    style.innerHTML = css;
    document.head.appendChild(style);
    document.body.appendChild(container);
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

  // NAVBAR SCROLL
  window.addEventListener("scroll", function () {
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
  });

  // THEME TOGGLE
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

  // FADE IN EFEKTİ
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

  // SPLASH SCREEN KAPATICI
  window.addEventListener('load', () => {
    setTimeout(() => {
      const splash = document.getElementById('splashScreen');
      if(splash) splash.classList.add('splash-fade');
    }, 1500); 
  });

  // PAYLAŞMA FONKSİYONU
  window.shareProduct = function(name, price, imgUrl) {
    const text = `Trend Optik'te şu modele bayıldım!\n\n🕶️ ${name}\n💰 Fiyat: ${price}\n\nSen de incele: https://www.trendoptikmersin.com/urunler`;
    if (navigator.share) {
      navigator.share({ title: 'Trend Optik', text: text }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Ürün bilgileri kopyalandı! İstediğin kişiye yapıştırıp gönderebilirsin.");
    }
  };

  // WHATSAPP TIKLAMA TAKİBİ FONKSİYONU
  window.askWhatsApp = async function(id, wpLink) {
    window.open(wpLink, '_blank'); 
    try {
      await updateDoc(doc(db, "products", id), { clicks: increment(1) }); 
    } catch(e) { console.log("Tıklama kaydedilemedi", e); }
  };

  // YENİ ÜRÜN KARTI OLUŞTURMA (isSlider parametresi ile vitrin ve tüm ürünler ayrıldı)
  function createProductCard(product, index, isSlider = false) {
    const finalPrice = product.price.toString().includes("₺") ? product.price : `${product.price} ₺`;
    const wpMessage = `Merhaba Trend Optik! Sitenizdeki "${product.name}" modeliyle ilgileniyorum. Fiyatı: ${finalPrice}. Stokta mevcut mu?`;
    const wpLink = `https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`;
    
    // Eğer vitrinse yan yana kayması için özel sınıf, normal sayfaysa grid sınıfı kullan
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

  // ==========================================
  // ANA SAYFA VİTRİNİ - KUSURSUZ AKIŞ (CSS TABANLI)
  // ==========================================
  if (homeProductGrid) {
    async function fetchHomeProducts() {
      homeProductGrid.innerHTML = `<div class="w-100 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(6));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          homeProductGrid.innerHTML = `<div class="w-100 text-center"><p>Henüz ürün eklenmedi.</p></div>`;
          return;
        }
        
        let htmlContent = "";
        let i = 0;
        querySnapshot.forEach((doc) => {
          // isSlider parametresini true gönderiyoruz
          htmlContent += createProductCard({ id: doc.id, ...doc.data() }, i++, true);
        });
        
        // VAHŞET HİLESİ: Sonsuz döngü hissi vermek için ürünleri YAN YANA İKİ KEZ basıyoruz. 
        // HTML'deki CSS animasyonu yarıya gelince başa saracak, kullanıcı bunu asla fark etmeyecek!
        homeProductGrid.innerHTML = htmlContent + htmlContent;
        
      } catch (error) {
        homeProductGrid.innerHTML = `<p class="text-danger text-center w-100">Ürünler yüklenemedi.</p>`;
      }
    }
    fetchHomeProducts();
  }

  // TÜM ÜRÜNLER SAYFASI (NORMAL GRID)
  if (allProductGrid) {
    async function fetchAllProducts() {
      allProductGrid.innerHTML = `<div class="col-12 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        allProducts = [];
        querySnapshot.forEach((doc) => {
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
        // isSlider false gidiyor, normal sayfada kartlar grid gibi alt alta dizelecek
        allProductGrid.innerHTML += createProductCard(product, index, false);
      });
      activateFade();
    }

    fetchAllProducts();

    if (searchInput) {
      searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(value) || p.desc.toLowerCase().includes(value));
        displayAllProducts(filtered);
      });
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const category = btn.dataset.category;
        const filtered = category === "all" ? allProducts : allProducts.filter(p => p.category === category);
        displayAllProducts(filtered);
      });
    });
  }

  // 3D HERO SLIDER
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
  setInterval(() => { current = (current + 1) % heroImages.length; updateSlider(); }, 4000);

  // SAYAÇ ANİMASYONU
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
            if (count < target) { counter.innerText = Math.ceil(count); requestAnimationFrame(update); } 
            else { counter.innerText = target; }
          }
          update();
        });
        started = true;
      }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }
  
  // ==========================================
  // GÖZLÜK SİPARİŞ TAKİP MANTIĞI
  // ==========================================
  const trackBtn = document.getElementById("trackBtn");
  const trackPhone = document.getElementById("trackPhone");
  const trackResult = document.getElementById("trackResult");

  if(trackBtn && trackPhone && trackResult) {
    trackBtn.addEventListener("click", async () => {
      let phoneVal = trackPhone.value.trim();
      if(!phoneVal) return alert("Lütfen telefon numaranızı girin!");

      trackBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
      trackBtn.disabled = true;

      try {
        const q = query(collection(db, "orders"));
        const qs = await getDocs(q);
        
        let foundOrder = null;
        qs.forEach((doc) => {
          if(doc.data().phone === phoneVal) foundOrder = doc.data();
        });

        trackResult.style.display = "block";
        if(foundOrder) {
          let statusColor = "#0dcaf0"; 
          let icon = "bi-gear-wide-connected";
          
          if(foundOrder.status === "Teslimata Hazır") { statusColor = "#25D366"; icon = "bi-check-circle-fill"; } 
          else if(foundOrder.status === "Teslim Edildi") { statusColor = "#6c757d"; icon = "bi-bag-check"; } 

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
          trackResult.innerHTML = `<div class="text-danger fw-bold"><i class="bi bi-exclamation-triangle"></i> Bu numaraya ait aktif bir sipariş bulunamadı.</div>`;
        }
      } catch (error) {
        trackResult.innerHTML = `<div class="text-danger fw-bold">Sorgulama hatası!</div>`;
      } finally {
        trackBtn.innerHTML = `Sorgula`;
        trackBtn.disabled = false;
      }
    });
  }

  // GİRİŞ ALANINA ODAKLANILDIĞINDA KUSURSUZ KAPSÜLÜN PARLAMASI
  if(trackPhone) {
    const trackSearchBar = document.getElementById('trackSearchBar');
    if (trackSearchBar) {
        trackPhone.addEventListener('focus', () => {
            trackSearchBar.classList.add('is-focused');
        });
        trackPhone.addEventListener('blur', () => {
            trackSearchBar.classList.remove('is-focused');
        });
    }
  }

});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit, updateDoc, doc, increment } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
  const navbar = document.querySelector(".navbar");
  const themeToggle = document.getElementById("themeToggle");
  const homeProductGrid = document.getElementById("homeProductGrid"); 
  const statsSection = document.querySelector("#nedenbiz");
  const counters = document.querySelectorAll(".counter");
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const menuCollapse = document.getElementById('menu');
  const navbarToggler = document.querySelector('.navbar-toggler');
  let bsCollapse;

  if (menuCollapse) {
    bsCollapse = new bootstrap.Collapse(menuCollapse, { toggle: false });
  }

  // Hamburger Menüyü Otomatik Kapatma (Mobilde tıklandığında)
  navLinks.forEach((l) => {
    l.addEventListener('click', () => {
      if (menuCollapse?.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  // Toggler Animasyonu (X olma efekti)
  navbarToggler?.addEventListener('click', function() {
    this.classList.toggle('active');
  });
  
  menuCollapse?.addEventListener('hidden.bs.collapse', function() {
    navbarToggler?.classList.remove('active');
  });

  // NAVBAR SCROLL
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
  });

  // THEME TOGGLE
  if (themeToggle) {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
      themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>';
    } else {
      themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>';
    }

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      if (document.body.classList.contains("light-mode")) {
        themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>';
        localStorage.setItem("theme", "light");
      } else {
        themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>';
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // FADE IN
  function activateFade() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
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

  // ==========================================
  // 1. POLARİZE SİMÜLATÖRÜ (JS)
  // ==========================================
  const simSlider = document.getElementById('simSlider');
  const simForeground = document.getElementById('simForeground');
  const simSliderBtn = document.getElementById('simSliderBtn');
  if(simSlider && simForeground && simSliderBtn) {
    const moveSlider = (val) => {
      simForeground.style.width = val + '%';
      simSliderBtn.style.left = val + '%';
    };
    simSlider.addEventListener('input', (e) => moveSlider(e.target.value));
    simSlider.addEventListener('touchmove', (e) => moveSlider(e.target.value), { passive: true });
    // Başlangıçta 50'de olsun
    moveSlider(50);
  }

  // ==========================================
  // 3. WHATSAPP TIKLAMA TAKİBİ
  // ==========================================
  window.askWhatsApp = async function(id, wpLink) {
    window.open(wpLink, '_blank');
    try {
      // Firebase'de clicks sayısını 1 artırır
      await updateDoc(doc(db, "products", id), { clicks: increment(1) });
    } catch(e) { console.log("Hata:", e); }
  };

  // PAYLAŞMA
  window.shareProduct = function(name, price, imgUrl) {
    const text = `Trend Optik'te şu modele bayıldım!\n🕶️ ${name}\n💰 Fiyat: ${price}\nİncele: https://www.trendoptikmersin.com/urunler.html`;
    if (navigator.share) { navigator.share({ title: 'Trend Optik', text: text }).catch(console.error); } 
    else { navigator.clipboard.writeText(text); alert("Ürün kopyalandı!"); }
  };

  // ÜRÜN KARTI OLUŞTURMA (Tıklama takibi entegreli)
  function createProductCard(product, index) {
    const finalPrice = product.price.toString().includes("₺") ? product.price : `${product.price} ₺`;
    const wpMessage = `Merhaba! Sitenizdeki "${product.name}" modeliyle ilgileniyorum. Fiyatı: ${finalPrice}. (Görsel: ${product.img})`;
    const wpLink = `https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`;
    
    return `
      <div class="col-lg-3 col-md-6 fade-in" style="transition-delay:${index * 0.1}s">
        <div class="card h-100 border-0 shadow-sm product-card">
          <div style="height:230px; overflow:hidden; position:relative;">
            <div style="background-image:url('${product.img}'); background-size:cover; background-position:center; filter:blur(20px); position:absolute; width:100%; height:100%; transform:scale(1.2); opacity:0.6;"></div>
            <img src="${product.img}" loading="lazy" style="height:230px; width:100%; object-fit:contain; position:relative; z-index:2;">
          </div>
          <div class="card-body text-center d-flex flex-column p-3">
            <h6 class="fw-bold mb-1 text-truncate">${product.name}</h6>
            <p class="opacity-75 small mb-auto text-truncate-2">${product.desc}</p>
            <p class="fw-bold accent fs-5 mt-3 mb-0">${finalPrice}</p>
            <div class="d-flex justify-content-center gap-2 mt-3">
              <button onclick="askWhatsApp('${product.id}', '${wpLink}')" class="btn btn-accent rounded-pill px-3 flex-grow-1" style="white-space: nowrap;">
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

  // ANA SAYFA VİTRİNİ (Sadece 4 ürün)
  if (homeProductGrid) {
    async function fetchHomeProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(4));
        const qs = await getDocs(q);
        homeProductGrid.innerHTML = "";
        let i = 0; qs.forEach((doc) => { homeProductGrid.innerHTML += createProductCard({ id: doc.id, ...doc.data() }, i++); });
        activateFade(); 
      } catch (error) { homeProductGrid.innerHTML = `<p class="text-danger">Yüklenemedi.</p>`; }
    }
    fetchHomeProducts();
  }

  // 3D HERO SLIDER
  const heroImages = document.querySelectorAll(".hero-img"); let current = 0;
  function updateSlider() {
    if(heroImages.length === 0) return;
    heroImages.forEach(img => img.classList.remove("active", "left", "right"));
    heroImages[current].classList.add("active");
    heroImages[(current - 1 + heroImages.length) % heroImages.length].classList.add("left");
    heroImages[(current + 1) % heroImages.length].classList.add("right");
  }
  updateSlider(); setInterval(() => { current = (current + 1) % heroImages.length; updateSlider(); }, 4000);

  // SAYAÇ ANİMASYONU
  if (statsSection && counters.length > 0) {
    let started = false;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        counters.forEach(counter => {
          const target = +counter.getAttribute("data-target");
          let count = 0; const speed = target / 100;
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
});

// Firebase v12.10.0 Importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

  // FADE IN EFEKTİ (Hizmetler ve Sayaç İçin Düzeltildi)
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
  
  // Sayfa yüklenir yüklenmez statik elementleri (hizmetler, yorumlar vs.) canlandır
  activateFade();

    // ==========================================
  // BURADAN İTİBAREN KOPYALA (Eski createProductCard'ı silip yerine bunu yapıştır)
  // ==========================================

  // SPLASH SCREEN KAPATICI
  window.addEventListener('load', () => {
    setTimeout(() => {
      const splash = document.getElementById('splashScreen');
      if(splash) splash.classList.add('splash-fade');
    }, 1500); // 1.5 saniye ekranda kalır
  });

  // PAYLAŞMA FONKSİYONU
  window.shareProduct = function(name, price, imgUrl) {
    const text = `Trend Optik'te şu modele bayıldım!\n\n🕶️ ${name}\n💰 Fiyat: ${price}\n\nSen de incele: https://www.trendoptikmersin.com/urunler.html`;
    if (navigator.share) {
      navigator.share({ title: 'Trend Optik', text: text }).catch(console.error);
    } else {
      // Telefon paylaşmayı desteklemiyorsa linki kopyala
      navigator.clipboard.writeText(text);
      alert("Ürün bilgileri kopyalandı! İstediğin kişiye yapıştırıp gönderebilirsin.");
    }
  };

  // YENİ ÜRÜN KARTI OLUŞTURMA (WhatsApp ve Paylaş Butonu Yanyana)
  function createProductCard(product, index) {
    const finalPrice = product.price.toString().includes("₺") ? product.price : `${product.price} ₺`;
    const wpMessage = `Merhaba Trend Optik! Sitenizdeki "${product.name}" modeliyle ilgileniyorum. Fiyatı: ${finalPrice}. Stokta mevcut mu? (Görsel: ${product.img})`;
    const wpLink = `https://wa.me/905312075818?text=${encodeURIComponent(wpMessage)}`;
    
    return `
      <div class="col-lg-3 col-md-6 fade-in" style="transition-delay:${index * 0.1}s">
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
  <a href="${wpLink}" target="_blank" class="btn btn-accent rounded-pill px-3 flex-grow-1" style="white-space: nowrap;">
    <i class="bi bi-whatsapp"></i> Sor
  </a>
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
  // BURAYA KADAR KOPYALA
  // ==========================================


  // ANA SAYFA VİTRİNİ (Sadece 4 ürün)
  if (homeProductGrid) {
    async function fetchHomeProducts() {
      homeProductGrid.innerHTML = `<div class="col-12 text-center my-5"><div class="spinner-border text-warning"></div></div>`;
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        homeProductGrid.innerHTML = "";
        if (querySnapshot.empty) {
          homeProductGrid.innerHTML = `<div class="col-12 text-center"><p>Henüz ürün eklenmedi.</p></div>`;
          return;
        }
        let i = 0;
        querySnapshot.forEach((doc) => {
          homeProductGrid.innerHTML += createProductCard({ id: doc.id, ...doc.data() }, i++);
        });
        activateFade(); // Ürünler geldikten sonra animasyonu tetikle
      } catch (error) {
        homeProductGrid.innerHTML = `<p class="text-danger text-center">Ürünler yüklenemedi.</p>`;
      }
    }
    fetchHomeProducts();
  }

  // TÜM ÜRÜNLER SAYFASI
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
        allProductGrid.innerHTML += createProductCard(product, index);
      });
      activateFade();
    }

    fetchAllProducts();

    // Arama Çubuğu
    if (searchInput) {
      searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(value) || p.desc.toLowerCase().includes(value));
        displayAllProducts(filtered);
      });
    }

    // Filtre Butonları
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

  // SAYAÇ ANİMASYONU (Düzeltildi)
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
});

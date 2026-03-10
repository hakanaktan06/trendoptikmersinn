document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     ELEMENTLER
  ========================== */
  const navbar = document.querySelector(".navbar");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const themeToggle = document.getElementById("themeToggle");
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const statsSection = document.querySelector("#nedenbiz");
  const counters = document.querySelectorAll(".counter");

  /* =========================
     NAVBAR SCROLL
  ========================== */
  window.addEventListener("scroll", function () {
    navbar?.classList.toggle("scrolled", window.scrollY > 50);
  });


/* =========================
   3D HERO SLIDER
========================= */

const heroImages = document.querySelectorAll(".hero-img");
let current = 0;

function updateSlider() {
  heroImages.forEach(img => {
    img.classList.remove("active", "left", "right");
  });

  const prev = (current - 1 + heroImages.length) % heroImages.length;
  const next = (current + 1) % heroImages.length;

  heroImages[current].classList.add("active");
  heroImages[prev].classList.add("left");
  heroImages[next].classList.add("right");
}

updateSlider();

setInterval(() => {
  current = (current + 1) % heroImages.length;
  updateSlider();
}, 4000);


  /* =========================
     HAMBURGER
  ========================== */
  if (navbarToggler) {
    navbarToggler.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  }

  if (navbarCollapse && navbarToggler) {
    navbarCollapse.addEventListener("hidden.bs.collapse", function () {
      navbarToggler.classList.remove("active");
    });

    const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });

    document.addEventListener("click", function (event) {
      const inside =
        navbarCollapse.contains(event.target) ||
        navbarToggler.contains(event.target);

      if (!inside && navbarCollapse.classList.contains("show")) {
        bsCollapse.hide();
      }
    });
  }

  // THEME TOGGLE (Temiz, duplicated yok)
if (themeToggle) {
  // Sayfa yüklenirken
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    navbar.classList.remove("navbar-dark");
    navbar.classList.add("navbar-light");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>';
  } else {
    themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>';
  }

  // Tıklandığında
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      themeToggle.innerHTML = '<i class="bi bi-sun-fill fs-4"></i>';
      navbar.classList.remove("navbar-dark");
      navbar.classList.add("navbar-light");
      localStorage.setItem("theme", "light");
    } else {
      themeToggle.innerHTML = '<i class="bi bi-moon-fill fs-4"></i>';
      navbar.classList.remove("navbar-light");
      navbar.classList.add("navbar-dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

  /* =========================
     ÜRÜNLER ÜRÜN EKLENEBİLİR
  ========================== */
  const products = [
    { name: "Ray-Ban Aviator Classic", category: "gunes", price: "2.500 - 3.500 ₺", img: "rayban-aviator-classic.jpg", desc: "Klasik pilot modeli, polarize cam seçenekli" },
    { name: "Prada Rectangular Black", category: "klasik", price: "4.000 - 5.500 ₺", img: "prada-rectangular-black.jpg", desc: "Şık dikdörtgen çerçeve, hafif titanyum malzeme" },
    { name: "Dolce & Gabbana Cat Eye", category: "kadin", price: "3.000 - 4.200 ₺", img: "dolce-gabbana-cat-eye.jpg", desc: "Kadınlara özel zarif kedi gözü tasarımı" },
    { name: "Oakley Sport Polarized", category: "spor", price: "1.800 - 2.800 ₺", img: "oakley-sport-polarized.jpg", desc: "Sporcular için yüksek dayanıklılık ve polarize lens" },
    { name: "Ray-Ban Junior Çocuk", category: "cocuk", price: "1.200 - 1.800 ₺", img: "rayban-junior-kids.jpg", desc: "Çocuklar için güvenli modeller" },




  ];

  function displayProducts(list) {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  list.forEach((product, index) => {
    productGrid.innerHTML += `
      <div class="col-lg-3 col-md-6 fade-in" style="transition-delay:${index * 0.1}s">
        <div class="card h-100 border-0 shadow-sm product-card">
          <div style="height:250px; overflow:hidden; position:relative;">
            <div style="background-image:url('${product.img}'); background-size:cover; background-position:center; filter:blur(20px); position:absolute; width:100%; height:100%; transform:scale(1.2); opacity:0.6;"></div>
            <img src="${product.img}" style="height:250px; width:100%; object-fit:contain; position:relative; z-index:2;">
          </div>
          <div class="card-body text-center">
            <h5 class="fw-bold">${product.name}</h5>
            <p class="opacity-75">${product.desc}</p>
            <p class="fw-bold accent">${product.price}</p>
            <a href="https://wa.me/905312075818?text=Merhaba%2C%20${encodeURIComponent(product.name)}%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum"
               class="btn btn-accent rounded-pill px-4">
              WhatsApp'tan Sor
            </a>
          </div>
        </div>
      </div>
    `;
  });

  activateFade();
}

  displayProducts(products);

  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const value = this.value.toLowerCase();
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.desc.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
      );
      displayProducts(filtered);
    });
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;
      const filtered = category === "all"
        ? products
        : products.filter(p => p.category === category);

      displayProducts(filtered);
    });
  });

  /* =========================
     FADE IN
  ========================== */
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

  /* =========================
     SAYAÇ ANİMASYONU
  ========================== */
  if (statsSection && counters.length > 0) {

    let started = false;

    function startCounters() {
      if (started) return;

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

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounters();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

});


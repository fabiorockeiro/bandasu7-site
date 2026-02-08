(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile menu
  const hamburger = document.querySelector("[data-hamburger]");
  const nav = document.querySelector("[data-nav]");

  function setExpanded(isOpen) {
    if (!hamburger) return;
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  function closeMenu() {
    document.body.classList.remove("menu-open");
    setExpanded(false);
    // Devolve foco para o botão do menu (acessibilidade)
    if (hamburger) hamburger.focus();
  }
  function toggleMenu() {
    const isOpen = document.body.classList.toggle("menu-open");
    setExpanded(isOpen);

    // Move foco para o primeiro item do menu quando abrir (acessibilidade)
    if (isOpen && nav) {
      const first = nav.querySelector("a");
      if (first) setTimeout(() => first.focus(), 0);
    }
  }

  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  if (nav) nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("menu-open")) return;
    const inNav = nav && nav.contains(e.target);
    const inBtn = hamburger && hamburger.contains(e.target);
    if (!inNav && !inBtn) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Active section highlight
  const links = Array.from(document.querySelectorAll(".nav-link"))
    .filter(a => a.getAttribute("href") && a.getAttribute("href").startsWith("#"));
  const targets = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove("is-active"));
      const id = "#" + entry.target.id;
      const active = links.find(l => l.getAttribute("href") === id);
      if (active) active.classList.add("is-active");
    });
  }, { threshold: 0.6 });

  targets.forEach(t => obs.observe(t));

  // ===== GALERIA (manutenção fácil) =====
  // Para adicionar fotos: só coloca o arquivo em assets/img e adiciona aqui.
  const GALLERY = [
    { src: "assets/img/Trio-001.jpg", cap: "SU7 • Trio" },
    { src: "assets/img/Trio-002.jpg", cap: "SU7 • Trio" },
    { src: "assets/img/Su7-001.jpg",  cap: "SU7 • Banda" },

    { src: "assets/img/Max-001.jpg",  cap: "Max • Voz" },
    { src: "assets/img/Max-002.jpg",  cap: "Max • Voz" },
    { src: "assets/img/Max-003.jpg",  cap: "Max • Voz" },
    { src: "assets/img/Max-004.jpg",  cap: "Max • Voz" },

    { src: "assets/img/Davi-001.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-002.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-003.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-004.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-004.jpeg",cap: "Davi • Baixo" },
    { src: "assets/img/Davi-005.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-006.jpg", cap: "Davi • Baixo" },

    { src: "assets/img/Djow-001.jpg", cap: "Djow • Bateria" },
    { src: "assets/img/Djow-002.jpg", cap: "Djow • Bateria" },
    { src: "assets/img/Djow-004.jpg", cap: "Djow • Bateria" },

    { src: "assets/img/Jonas-002.jpg", cap: "Jonas • Teclado" },
    { src: "assets/img/jonas-001.jpg", cap: "Jonas • Teclado" },

    { src: "assets/img/Fabio-001.jpg", cap: "Fábio • Guitarra" },
    { src: "assets/img/Fabio-002.jpg", cap: "Fábio • Guitarra" },
    { src: "assets/img/Fabio-003.jpg", cap: "Fábio • Guitarra" },
    { src: "assets/img/Fabio-004.jpg", cap: "Fábio • Guitarra" },

    { src: "assets/img/img-001.jpg", cap: "SU7" },
    { src: "assets/img/img-002.jpg", cap: "SU7" },
    { src: "assets/img/img-003.jpg", cap: "SU7" },
    { src: "assets/img/img-004.jpg", cap: "SU7" },
  ];

  const mosaic = document.getElementById("mosaic");
  const spans = ["span-3x3", "span-4x3", "span-4x4", "span-6x4", "span-6x5"];

  // Embaralhar pra deixar “abstrato” e diferente a cada load
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let galleryOrder = shuffle(GALLERY);

  function buildMosaic() {
    if (!mosaic) return;
    mosaic.innerHTML = "";

    galleryOrder.forEach((item, idx) => {
      const tile = document.createElement("div");
      tile.className = "tile " + spans[idx % spans.length];
      tile.setAttribute("data-idx", String(idx));

      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = item.src;
      img.alt = item.cap || "Foto SU7";

      const cap = document.createElement("div");
      cap.className = "cap";
      cap.textContent = item.cap || "SU7";

      tile.appendChild(img);
      tile.appendChild(cap);
      mosaic.appendChild(tile);
    });
  }

  buildMosaic();

  // ===== Lightbox =====
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let current = 0;

  function openLB(i) {
    if (!lb || !lbImg) return;
    current = i;
    const item = galleryOrder[current];
    lbImg.src = item.src;
    lbCap.textContent = (item.cap || "SU7").toUpperCase();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLB() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function go(step) {
    const total = galleryOrder.length;
    current = (current + step + total) % total;
    const item = galleryOrder[current];
    lbImg.src = item.src;
    lbCap.textContent = (item.cap || "SU7").toUpperCase();
  }

  if (mosaic) {
    mosaic.addEventListener("click", (e) => {
      const tile = e.target.closest(".tile");
      if (!tile) return;
      const idx = Number(tile.getAttribute("data-idx") || "0");
      openLB(idx);
    });
  }

  if (lbClose) lbClose.addEventListener("click", closeLB);
  if (lbPrev) lbPrev.addEventListener("click", () => go(-1));
  if (lbNext) lbNext.addEventListener("click", () => go(+1));

  document.addEventListener("keydown", (e) => {
    if (!lb || !lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(+1);
  });

  if (lb) {
    lb.addEventListener("click", (e) => {
      // Clicar no fundo fecha (mas não em botões/imagem)
      const isBg = e.target === lb;
      if (isBg) closeLB();
    });
  }
})();


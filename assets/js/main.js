(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const hamburger = document.querySelector("[data-hamburger]");
  const nav = document.querySelector("[data-nav]");

  function setExpanded(isOpen) {
    if (!hamburger) return;
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    setExpanded(false);
    if (hamburger) hamburger.focus();
  }

  function toggleMenu() {
    const isOpen = document.body.classList.toggle("menu-open");
    setExpanded(isOpen);

    if (isOpen && nav) {
      const first = nav.querySelector("a");
      if (first) setTimeout(() => first.focus(), 0);
    }
  }

  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  if (nav) {
    nav.addEventListener("click", (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;
      closeMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("menu-open")) return;
    const inNav = nav && nav.contains(e.target);
    const inButton = hamburger && hamburger.contains(e.target);
    if (!inNav && !inButton) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  const links = Array.from(document.querySelectorAll(".nav-link"))
    .filter((anchor) => anchor.getAttribute("href") && anchor.getAttribute("href").startsWith("#"));
  const targets = links
    .map((anchor) => document.querySelector(anchor.getAttribute("href")))
    .filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.remove("is-active"));
      const id = "#" + entry.target.id;
      const active = links.find((link) => link.getAttribute("href") === id);
      if (active) active.classList.add("is-active");
    });
  }, { threshold: 0.6 });

  targets.forEach((target) => obs.observe(target));

  const MEMBERS = [
    {
      id: "max",
      name: "Max",
      title: "Voz e Multi-instrumentista",
      navRole: "Voz",
      photo: "assets/img/Max-001.jpg",
      photoAlt: "Max, vocalista da Banda SU7",
      instagramUrl: "https://www.instagram.com/maxxvoz/",
      instagramHandle: "@maxxvoz",
      accentFrom: "#ffb547",
      accentTo: "rgba(255,181,71,.20)",
      bio: "Voz da SU7, Max une presen\u00e7a de palco, versatilidade e leitura musical ao repert\u00f3rio da banda. Como multi-instrumentista e professor, contribui com arranjos firmes e interpreta\u00e7\u00e3o consistente ao vivo."
    },
    {
      id: "davi",
      name: "Davi",
      title: "Baixista e Fundador",
      navRole: "Baixo",
      photo: "assets/img/Davi-001.jpg",
      photoAlt: "Davi, baixista e fundador da Banda SU7",
      instagramUrl: "https://www.instagram.com/davi.su7/",
      instagramHandle: "@davi.su7",
      accentFrom: "#1a8cff",
      accentTo: "rgba(26,140,255,.20)",
      bio: "Fundador e baixista da SU7, Davi sustenta a base musical da banda com precis\u00e3o e vis\u00e3o de conjunto. Seu trabalho ajuda a moldar a identidade sonora e a dire\u00e7\u00e3o do minist\u00e9rio desde a forma\u00e7\u00e3o."
    },
    {
      id: "djow",
      name: "Djow Kielek",
      title: "Baterista",
      navRole: "Bateria",
      photo: "assets/img/Djow-001.jpg",
      photoAlt: "Djow Kielek, baterista da Banda SU7",
      instagramUrl: "https://www.instagram.com/djow_kielek/",
      instagramHandle: "@djow_kielek",
      accentFrom: "#ff7a3d",
      accentTo: "rgba(255,122,61,.20)",
      bio: "Baterista da SU7 desde 2018, Djow Kielek soma experi\u00eancia em igreja, eventos e trabalhos com artistas da m\u00fasica gospel nacional. Sua pegada traz energia, controle e presen\u00e7a \u00e0 base r\u00edtmica da banda."
    },
    {
      id: "jonas",
      name: "Jonas Souza",
      title: "Tecladista e Diretor Musical",
      navRole: "Teclado",
      photo: "assets/img/Jonas-002.jpg",
      photoAlt: "Jonas Souza, tecladista da Banda SU7",
      instagramUrl: "https://www.instagram.com/jonassouzamusic/",
      instagramHandle: "@jonassouzamusic",
      accentFrom: "#38d6d1",
      accentTo: "rgba(56,214,209,.18)",
      bio: "Tecladista, pianista, produtor e diretor musical, Jonas Souza atua h\u00e1 mais de 15 anos no mercado e \u00e9 formado pelo Conservat\u00f3rio Carlos Gomes. Na SU7, contribui com arranjos, repert\u00f3rio e dire\u00e7\u00e3o musical."
    },
    {
      id: "fabio",
      name: "F\u00e1bio Rockeiro",
      title: "Guitarrista",
      navRole: "Guitarra",
      photo: "assets/img/Fabio-001.jpg",
      photoAlt: "F\u00e1bio Rockeiro, guitarrista da Banda SU7",
      instagramUrl: "https://www.instagram.com/brincarderock/",
      instagramHandle: "@brincarderock",
      accentFrom: "#2fca8b",
      accentTo: "rgba(47,202,139,.18)",
      bio: "Guitarrista da SU7, F\u00e1bio Rockeiro adiciona textura, peso e identidade \u00e0s apresenta\u00e7\u00f5es da banda. Seu trabalho fortalece os arranjos ao vivo com personalidade e presen\u00e7a."
    }
  ];

  function initMembersCarousel() {
    const carousel = document.getElementById("membersCarousel");
    const tabsWrap = document.getElementById("memberTabs");
    const shell = document.getElementById("memberPanelShell");
    if (!carousel || !tabsWrap || !shell) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const total = MEMBERS.length;
    const AUTOPLAY_MS = 8000;
    const tabs = [];

    let reduceMotion = prefersReducedMotion.matches;
    let index = 0;
    let timer = null;
    let swapTimer = null;
    let touchStartX = 0;
    let touchStartY = 0;

    const panel = document.createElement("article");
    panel.className = "member-panel";
    panel.id = "memberPanel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-atomic", "true");

    const photoPane = document.createElement("div");
    photoPane.className = "member-photo-pane";

    const photo = document.createElement("img");
    photo.decoding = "async";

    const photoTag = document.createElement("div");
    photoTag.className = "member-photo-tag";

    const copy = document.createElement("div");
    copy.className = "member-copy";

    const eyebrow = document.createElement("div");
    eyebrow.className = "member-eyebrow";
    eyebrow.textContent = "Mini biografia";

    const name = document.createElement("h3");
    name.className = "member-name";

    const role = document.createElement("div");
    role.className = "member-role";

    const bio = document.createElement("p");
    bio.className = "member-bio";

    const actions = document.createElement("div");
    actions.className = "member-actions";

    const link = document.createElement("a");
    link.className = "member-link";
    link.target = "_blank";
    link.rel = "noreferrer noopener";

    const linkLabel = document.createElement("span");
    linkLabel.textContent = "Instagram";

    const handle = document.createElement("span");
    handle.className = "member-link__handle";

    photoPane.appendChild(photo);
    photoPane.appendChild(photoTag);

    link.appendChild(linkLabel);
    link.appendChild(handle);

    actions.appendChild(link);
    copy.appendChild(eyebrow);
    copy.appendChild(name);
    copy.appendChild(role);
    copy.appendChild(bio);
    copy.appendChild(actions);

    panel.appendChild(photoPane);
    panel.appendChild(copy);
    shell.appendChild(panel);

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function start() {
      stop();
      if (reduceMotion || total <= 1) return;
      timer = window.setInterval(() => {
        renderMember(index + 1, "autoplay");
      }, AUTOPLAY_MS);
    }

    function syncMotionPreference() {
      reduceMotion = prefersReducedMotion.matches;
      carousel.classList.toggle("is-reduced-motion", reduceMotion);
      panel.setAttribute("aria-live", reduceMotion ? "polite" : "off");
      if (reduceMotion) stop();
      else start();
    }

    function applyMember(member) {
      panel.style.setProperty("--member-accent-from", member.accentFrom);
      panel.style.setProperty("--member-accent-to", member.accentTo);
      photo.src = member.photo;
      photo.alt = member.photoAlt;
      photo.loading = index === 0 ? "eager" : "lazy";
      photoTag.textContent = member.name;
      name.textContent = member.name;
      role.textContent = member.title;
      bio.textContent = member.bio;
      link.href = member.instagramUrl;
      link.setAttribute("aria-label", `Instagram de ${member.name}`);
      handle.textContent = member.instagramHandle;
    }

    function updateTabs(source) {
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;

        if (active) {
          panel.setAttribute("aria-labelledby", tab.id);
          if (source === "keyboard") tab.focus();
        }
      });
    }

    function renderMember(nextIndex, source) {
      index = (nextIndex + total) % total;
      updateTabs(source);

      window.clearTimeout(swapTimer);

      if (reduceMotion || source === "initial") {
        panel.classList.remove("is-swapping");
        applyMember(MEMBERS[index]);
        return;
      }

      panel.classList.add("is-swapping");
      swapTimer = window.setTimeout(() => {
        applyMember(MEMBERS[index]);
        requestAnimationFrame(() => {
          panel.classList.remove("is-swapping");
        });
      }, 130);
    }

    MEMBERS.forEach((member, memberIndex) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "member-tab";
      tab.id = `member-tab-${member.id}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.setAttribute("aria-label", `Ver biografia de ${member.name}`);
      tab.style.setProperty("--member-tab-accent", member.accentFrom);
      tab.style.setProperty("--member-tab-accent-soft", member.accentTo);

      const tabName = document.createElement("span");
      tabName.className = "member-tab__name";
      tabName.textContent = member.name.split(" ")[0];

      const tabRole = document.createElement("span");
      tabRole.className = "member-tab__role";
      tabRole.textContent = member.navRole;

      tab.appendChild(tabName);
      tab.appendChild(tabRole);

      tab.addEventListener("click", () => {
        renderMember(memberIndex, "manual");
        start();
      });

      tabsWrap.appendChild(tab);
      tabs.push(tab);
    });

    carousel.classList.add("is-ready");

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!carousel.contains(document.activeElement)) start();
      }, 0);
    });

    tabsWrap.addEventListener("keydown", (e) => {
      const focusedIndex = tabs.indexOf(document.activeElement);
      if (focusedIndex === -1) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        renderMember(focusedIndex + 1, "keyboard");
        start();
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        renderMember(focusedIndex - 1, "keyboard");
        start();
      }

      if (e.key === "Home") {
        e.preventDefault();
        renderMember(0, "keyboard");
        start();
      }

      if (e.key === "End") {
        e.preventDefault();
        renderMember(total - 1, "keyboard");
        start();
      }
    });

    shell.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stop();
    }, { passive: true });

    shell.addEventListener("touchend", (e) => {
      if (!touchStartX && !touchStartY) {
        start();
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        renderMember(deltaX < 0 ? index + 1 : index - 1, "manual");
      }

      touchStartX = 0;
      touchStartY = 0;
      start();
    }, { passive: true });

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", syncMotionPreference);
    } else if (typeof prefersReducedMotion.addListener === "function") {
      prefersReducedMotion.addListener(syncMotionPreference);
    }

    renderMember(0, "initial");
    syncMotionPreference();
  }

  initMembersCarousel();

  const GALLERY = [
    { src: "assets/img/Trio-001.jpg", cap: "SU7 • Trio" },
    { src: "assets/img/Trio-002.jpg", cap: "SU7 • Trio" },
    { src: "assets/img/Su7-001.jpg", cap: "SU7 • Banda" },
    { src: "assets/img/Max-001.jpg", cap: "Max • Voz" },
    { src: "assets/img/Max-002.jpg", cap: "Max • Voz" },
    { src: "assets/img/Max-003.jpg", cap: "Max • Voz" },
    { src: "assets/img/Max-004.jpg", cap: "Max • Voz" },
    { src: "assets/img/Davi-001.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-002.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-003.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-004.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-004.jpeg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-005.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Davi-006.jpg", cap: "Davi • Baixo" },
    { src: "assets/img/Djow-001.jpg", cap: "Djow • Bateria" },
    { src: "assets/img/Djow-002.jpg", cap: "Djow • Bateria" },
    { src: "assets/img/Djow-004.jpg", cap: "Djow • Bateria" },
    { src: "assets/img/Djow-006.jpg", cap: "Djow • Bateria" },
    { src: "assets/img/Jonas-002.jpg", cap: "Jonas • Teclado" },
    { src: "assets/img/jonas-001.jpg", cap: "Jonas • Teclado" },
    { src: "assets/img/Fabio-001.jpg", cap: "Fábio • Guitarra" },
    { src: "assets/img/Fabio-002.jpg", cap: "Fábio • Guitarra" },
    { src: "assets/img/Fabio-003.jpg", cap: "Fábio • Guitarra" },
    { src: "assets/img/img-001.jpg", cap: "SU7" },
    { src: "assets/img/img-002.jpg", cap: "SU7" },
    { src: "assets/img/img-003.jpg", cap: "SU7" },
    { src: "assets/img/img-004.jpg", cap: "SU7" }
  ];

  const mosaic = document.getElementById("mosaic");
  const spans = ["span-3x3", "span-4x3", "span-4x4", "span-6x4", "span-6x5"];
  let lastGalleryTrigger = null;

  function shuffle(arr) {
    const clone = arr.slice();
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  let galleryOrder = shuffle(GALLERY);

  function buildMosaic() {
    if (!mosaic) return;
    mosaic.innerHTML = "";

    galleryOrder.forEach((item, idx) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile " + spans[idx % spans.length];
      tile.setAttribute("data-idx", String(idx));
      tile.setAttribute("aria-label", `Abrir ${item.cap || "foto da SU7"}`);

      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
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

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let current = 0;

  function openLB(nextIndex) {
    if (!lb || !lbImg || !galleryOrder.length) return;
    const total = galleryOrder.length;
    current = ((nextIndex % total) + total) % total;
    lastGalleryTrigger = document.activeElement && typeof document.activeElement.focus === "function"
      ? document.activeElement
      : null;

    const item = galleryOrder[current];
    lbImg.src = item.src;
    lbImg.alt = item.cap || "Foto SU7";
    if (lbCap) lbCap.textContent = (item.cap || "SU7").toUpperCase();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }

  function closeLB() {
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastGalleryTrigger && typeof lastGalleryTrigger.focus === "function") {
      lastGalleryTrigger.focus();
    }
  }

  function go(step) {
    if (!galleryOrder.length || !lbImg) return;
    const total = galleryOrder.length;
    current = (current + step + total) % total;
    const item = galleryOrder[current];
    lbImg.src = item.src;
    lbImg.alt = item.cap || "Foto SU7";
    if (lbCap) lbCap.textContent = (item.cap || "SU7").toUpperCase();
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
  if (lbNext) lbNext.addEventListener("click", () => go(1));

  document.addEventListener("keydown", (e) => {
    if (!lb || !lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  if (lb) {
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLB();
    });
  }
})();

// =========================
// AGENDAS: carrossel + lightbox
// =========================
(function initAgendasCarousel(){
  const track = document.getElementById("agendaTrack");
  const dotsWrap = document.getElementById("agendaDots");
  if(!track || !dotsWrap) return;

  const candidates = (i) => ([
    `assets/img/agendas/Agenda-${String(i).padStart(3, "0")}.png`,
  ]);

  let slides = [];
  let index = 0;
  let timer = null;
  const AUTOPLAY_MS = 3500;

  function setTransform(){
    track.style.transform = `translateX(${-index * 100}%)`;
    [...dotsWrap.children].forEach((d, di) => d.classList.toggle("is-active", di === index));
  }

  function next(){
    if(slides.length <= 1) return;
    index = (index + 1) % slides.length;
    setTransform();
  }

  function prev(){
    if(slides.length <= 1) return;
    index = (index - 1 + slides.length) % slides.length;
    setTransform();
  }

  function start(){
    stop();
    if(slides.length <= 1) return;
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function stop(){
    if(timer) clearInterval(timer);
    timer = null;
  }

  function openLightbox(src){
    let lb = document.querySelector(".agenda-lightbox");
    let lbImg = lb ? lb.querySelector("img") : null;

    if(!lb){
      lb = document.createElement("div");
      lb.className = "agenda-lightbox";
      lb.innerHTML = `<div class="agenda-lightbox__backdrop"></div><img alt="Agenda" />`;
      document.body.appendChild(lb);
      lbImg = lb.querySelector("img");

      lb.addEventListener("click", () => lb.classList.remove("is-open"));
      document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") lb.classList.remove("is-open");
      });
    }

    lbImg.src = src;
    lb.classList.add("is-open");
  }

  (function ensureLightboxCSS(){
    if(document.getElementById("agendaLightboxCSS")) return;
    const s = document.createElement("style");
    s.id = "agendaLightboxCSS";
    s.textContent = `
      .agenda-lightbox{
        position: fixed; inset: 0; z-index: 9999;
        display: none; place-items: center;
      }
      .agenda-lightbox.is-open{ display: grid; }
      .agenda-lightbox__backdrop{
        position:absolute; inset:0;
        background: rgba(0,0,0,.82);
      }
      .agenda-lightbox img{
        position: relative;
        max-width: min(92vw, 1100px);
        max-height: 86vh;
        border-radius: 14px;
        box-shadow: 0 30px 90px rgba(0,0,0,.55);
      }
    `;
    document.head.appendChild(s);
  })();

  function addSlide(resolvedSrc){
    const slide = document.createElement("div");
    slide.className = "agenda-slide";
    slide.innerHTML = `<img src="${resolvedSrc}" alt="Agenda" loading="lazy">`;
    const img = slide.querySelector("img");
    img.addEventListener("click", () => openLightbox(resolvedSrc));
    track.appendChild(slide);
    slides.push(resolvedSrc);
  }

  function addDot(){
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "agenda-dot";
    dot.addEventListener("click", () => {
      index = [...dotsWrap.children].indexOf(dot);
      setTransform();
      start();
    });
    dotsWrap.appendChild(dot);
  }

  async function resolveSrc(i){
    const opts = candidates(i);
    for(const src of opts){
      const ok = await new Promise((res) => {
        const img = new Image();
        img.onload = () => res(true);
        img.onerror = () => res(false);
        img.src = src;
      });
      if(ok) return src;
    }
    return null;
  }

  (async function build(){
    const HARD_CAP = 500;
    const MISS_LIMIT = 8;
    let missStreak = 0;
    const found = [];

    for (let i = 1; i <= HARD_CAP; i++) {
      const src = await resolveSrc(i);
      if (src) {
        found.push(i);
        missStreak = 0;
      } else {
        missStreak++;
        if (missStreak >= MISS_LIMIT) break;
      }
    }

    if (found.length === 0) {
      track.innerHTML = `<div style="padding:16px;opacity:.8">Sem imagens de agenda ainda.</div>`;
      dotsWrap.style.display = "none";
      return;
    }

    found.sort((a, b) => b - a);

    for (const i of found) {
      const src = await resolveSrc(i);
      if (src) {
        addSlide(src);
        addDot();
      }
    }

    const prevBtn = document.querySelector(".agenda-nav--prev");
    const nextBtn = document.querySelector(".agenda-nav--next");
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); start(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); start(); });

    const carousel = document.querySelector(".agenda-carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      carousel.addEventListener("focusin", stop);
      carousel.addEventListener("focusout", start);
    }

    index = 0;
    setTransform();
    start();
  })();
})();

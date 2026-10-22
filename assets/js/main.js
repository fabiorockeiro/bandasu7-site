(() => {
  "use strict";

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Responsive derivatives keep the original files available from the viewer.
  const imageWidths = {
    "assets/img/Davi-001.jpg": 853,
    "assets/img/Davi-002.jpg": 853,
    "assets/img/Davi-003.jpg": 853,
    "assets/img/Djow-002.jpg": 853,
    "assets/img/img-003.jpg": 730,
    "assets/img/jonas-001.jpg": 853,
    "assets/img/Max-001.jpg": 853,
    "assets/img/mmm2-1024x530.png": 500,
    "assets/img/agendas/Agenda-013.png": 896,
  };
  function responsiveBase(src) {
    return src
      .replace("assets/img/", "assets/img/responsive/")
      .replace(/\.(\w+)$/, "-$1");
  }
  function setResponsiveImage(img, original, sizes) {
    const base = responsiveBase(original);
    img.sizes = sizes;
    const fullWidth = imageWidths[original] || 960;
    img.srcset =
      base +
      "-480.webp " +
      Math.min(480, fullWidth) +
      "w, " +
      base +
      "-960.webp " +
      Math.min(960, fullWidth) +
      "w";
    img.src = base + "-480.webp";
  }

  // Silent stage loop: responsive source, explicit pause and a still-image fallback.
  const heroVideo = document.getElementById("heroVideo");
  const videoToggle = document.getElementById("videoToggle");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  let manuallyPaused =
    motion.matches || Boolean(connection && connection.saveData);
  let heroVisible = true;
  let featurePlaying = false;
  function videoLabel(playing) {
    videoToggle.querySelector("[data-video-label]").textContent = playing
      ? "Pausar vídeo"
      : "Reproduzir vídeo";
    videoToggle.querySelector("[data-video-icon]").textContent = playing
      ? "Ⅱ"
      : "▶";
    videoToggle.setAttribute(
      "aria-label",
      playing
        ? "Pausar vídeo de fundo do show"
        : "Reproduzir vídeo de fundo do show",
    );
  }
  function loadHero() {
    if (heroVideo.hasAttribute("src")) return;
    heroVideo.src = window.matchMedia("(max-width: 760px)").matches
      ? heroVideo.dataset.mobileSrc
      : heroVideo.dataset.desktopSrc;
    heroVideo.muted = true;
  }
  function syncHero() {
    if (
      manuallyPaused ||
      !heroVisible ||
      document.hidden ||
      featurePlaying ||
      !document.querySelector(".reel").paused
    ) {
      heroVideo.pause();
      return;
    }
    loadHero();
    const playing = heroVideo.play();
    if (playing) playing.catch(() => videoLabel(false));
  }
  heroVideo.addEventListener("playing", () => {
    heroVideo.classList.add("is-playing");
    videoLabel(true);
  });
  heroVideo.addEventListener("pause", () => videoLabel(false));
  heroVideo.addEventListener("error", () => {
    heroVideo.classList.remove("is-playing");
    videoLabel(false);
  });
  videoToggle.hidden = false;
  videoLabel(false);
  videoToggle.addEventListener("click", () => {
    manuallyPaused = !heroVideo.paused;
    if (!manuallyPaused) featurePlaying = false;
    syncHero();
  });
  motion.addEventListener("change", () => {
    manuallyPaused = motion.matches;
    syncHero();
  });
  document.addEventListener("visibilitychange", syncHero);
  const heroObserver = new IntersectionObserver(
    (entries) => {
      heroVisible = entries[0].isIntersecting;
      syncHero();
    },
    { threshold: 0.05 },
  );
  heroObserver.observe(document.getElementById("home"));
  syncHero();

  // The official track loads only on request, leaving the opening focused on the show.
  const featuredPlay = document.getElementById("playFeatured");
  featuredPlay.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/bHc_WxYSxEs?autoplay=1&rel=0";
    iframe.title = "Filho de Davi — Banda SU7";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    document.getElementById("featuredPlayer").replaceChildren(iframe);
    featurePlaying = true;
    heroVideo.pause();
    iframe.focus();
  });
  const demo = document.querySelector(".reel");
  demo.addEventListener("play", () => heroVideo.pause());
  demo.addEventListener("pause", syncHero);

  // Navigation: keep focus predictable on mobile and follow the visible section.
  const hamburger = document.querySelector("[data-hamburger]");
  const nav = document.querySelector("[data-nav]");
  function closeMenu(restoreFocus = false) {
    const wasOpen = document.body.classList.contains("menu-open");
    document.body.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menu");
    if (wasOpen && restoreFocus) hamburger.focus();
  }
  hamburger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open) nav.querySelector("a").focus();
  });
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const wasOpen = document.body.classList.contains("menu-open");
    closeMenu();
    if (wasOpen) {
      const section = document.querySelector(link.hash);
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
    }
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !hamburger.contains(event.target))
      closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("menu-open")
    ) {
      closeMenu(true);
    }
  });
  const mobile = window.matchMedia("(max-width: 760px)");
  mobile.addEventListener("change", () => closeMenu());

  const links = [...nav.querySelectorAll(".nav-link")];
  const sections = links.map((link) => document.querySelector(link.hash));
  let scrollQueued = false;
  function updateNavigation() {
    const marker = document.querySelector(".site-header").offsetHeight + 80;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) current = section;
    });
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4
    ) {
      current = sections[sections.length - 1];
    }
    links.forEach((link) => {
      const active = link.hash === "#" + current.id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scrollQueued = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(updateNavigation);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateNavigation);
  updateNavigation();

  // Event dates use the band's local timezone, independent of the visitor.
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Cuiaba",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type) => dateParts.find((item) => item.type === type).value;
  const today = [part("year"), part("month"), part("day")].join("-");
  document.querySelectorAll("[data-event-date]").forEach((event) => {
    const past = event.dataset.eventDate < today;
    event.classList.toggle("is-past", past);
    event.querySelector(".event-status").textContent = past
      ? "JÁ ESTIVEMOS POR AQUI"
      : event.dataset.eventDate === today
        ? "É HOJE"
        : "NA AGENDA";
  });

  // Keep previous events available without mixing them with upcoming dates.
  const eventList = document.querySelector(".agenda-list");
  const pastEvents = [...eventList.querySelectorAll(".is-past")];
  if (pastEvents.length) {
    const history = document.createElement("details");
    history.className = "past-events";
    const summary = document.createElement("summary");
    summary.textContent = "Por onde já passamos";
    const list = document.createElement("div");
    list.setAttribute("role", "list");
    list.append(...pastEvents);
    history.append(summary, list);
    eventList.after(history);
    if (!eventList.querySelector(".agenda-item")) {
      eventList.removeAttribute("role");
      const empty = document.createElement("p");
      empty.className = "agenda-empty";
      empty.textContent =
        "Novas datas em breve. Fale com a gente para levar a SU7 ao seu evento.";
      eventList.append(empty);
    }
  }

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
      bio: "Voz da SU7, Max une presen\u00e7a de palco, versatilidade e leitura musical ao repert\u00f3rio da banda. Como multi-instrumentista e professor, contribui com arranjos firmes e interpreta\u00e7\u00e3o consistente ao vivo.",
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
      bio: "Fundador e baixista da SU7, Davi sustenta a base musical da banda com precis\u00e3o e vis\u00e3o de conjunto. Seu trabalho ajuda a moldar a identidade sonora e a dire\u00e7\u00e3o do minist\u00e9rio desde a forma\u00e7\u00e3o.",
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
      bio: "Baterista da SU7 desde 2018, Djow Kielek soma experi\u00eancia em igreja, eventos e trabalhos com artistas da m\u00fasica gospel nacional. Sua pegada traz energia, controle e presen\u00e7a \u00e0 base r\u00edtmica da banda.",
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
      bio: "Tecladista, pianista, produtor e diretor musical, Jonas Souza atua h\u00e1 mais de 15 anos no mercado e \u00e9 formado pelo Conservat\u00f3rio Carlos Gomes. Na SU7, contribui com arranjos, repert\u00f3rio e dire\u00e7\u00e3o musical.",
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
      bio: "Guitarrista da SU7, F\u00e1bio Rockeiro adiciona textura, peso e identidade \u00e0s apresenta\u00e7\u00f5es da banda. Seu trabalho fortalece os arranjos ao vivo com personalidade e presen\u00e7a.",
    },
  ];

  // Deliberate selection keeps biographies readable without automatic rotation.
  const tabsWrap = document.getElementById("memberTabs");
  const shell = document.getElementById("memberPanelShell");
  const panel = document.createElement("article");
  panel.className = "member-panel";
  panel.id = "memberPanel";
  panel.setAttribute("role", "tabpanel");
  panel.tabIndex = 0;
  panel.innerHTML =
    '<div class="member-photo-pane"><img loading="lazy" decoding="async" /><div class="member-photo-tag"></div></div><div class="member-copy"><div class="member-eyebrow">Conheça o integrante</div><h3 class="member-name"></h3><div class="member-role"></div><p class="member-bio"></p><div class="member-actions"><a class="member-link" target="_blank" rel="noopener noreferrer"><span>Instagram ↗</span><span class="member-link__handle"></span></a></div></div>';
  shell.append(panel);
  let memberIndex = 0;
  const tabs = MEMBERS.map((member, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "member-tab";
    button.id = "member-tab-" + member.id;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panel.id);
    button.setAttribute("aria-label", "Ver biografia de " + member.name);
    const name = document.createElement("span");
    name.className = "member-tab__name";
    name.textContent = member.name.split(" ")[0];
    const role = document.createElement("span");
    role.className = "member-tab__role";
    role.textContent = member.navRole;
    button.append(name, role);
    button.addEventListener("click", () => selectMember(index));
    tabsWrap.append(button);
    return button;
  });
  function selectMember(nextIndex, moveFocus = false) {
    memberIndex = (nextIndex + MEMBERS.length) % MEMBERS.length;
    const member = MEMBERS[memberIndex];
    tabs.forEach((tab, index) => {
      const active = index === memberIndex;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[memberIndex].id);
    const photo = panel.querySelector("img");
    setResponsiveImage(
      photo,
      member.photo,
      "(max-width: 760px) calc(100vw - 40px), 510px",
    );
    photo.alt = member.photoAlt;
    panel.querySelector(".member-photo-tag").textContent = member.name;
    panel.querySelector(".member-name").textContent = member.name;
    panel.querySelector(".member-role").textContent = member.title;
    panel.querySelector(".member-bio").textContent = member.bio;
    panel.querySelector(".member-link").href = member.instagramUrl;
    panel
      .querySelector(".member-link")
      .setAttribute("aria-label", "Instagram de " + member.name);
    panel.querySelector(".member-link__handle").textContent =
      member.instagramHandle;
    if (moveFocus) tabs[memberIndex].focus();
  }
  tabsWrap.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    const keys = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: MEMBERS.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      selectMember(keys[event.key], true);
    }
  });
  let touch = null;
  shell.addEventListener(
    "touchstart",
    (event) => {
      touch = event.touches.length === 1 ? event.touches[0] : null;
    },
    { passive: true },
  );
  shell.addEventListener(
    "touchend",
    (event) => {
      if (!touch) return;
      const dx = event.changedTouches[0].clientX - touch.clientX;
      const dy = event.changedTouches[0].clientY - touch.clientY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        selectMember(memberIndex + (dx < 0 ? 1 : -1));
      }
      touch = null;
    },
    { passive: true },
  );
  shell.addEventListener(
    "touchcancel",
    () => {
      touch = null;
    },
    { passive: true },
  );
  selectMember(0);
  document.getElementById("membersCarousel").classList.add("is-ready");

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
    { src: "assets/img/img-004.jpg", cap: "SU7" },
  ];

  // Lead with a consistent selection; every original photo remains available.
  const featured = [
    "Trio-001.jpg",
    "Max-001.jpg",
    "Fabio-001.jpg",
    "Davi-001.jpg",
    "Djow-001.jpg",
    "Jonas-002.jpg",
  ];
  const gallery = [
    ...featured.map((file) =>
      GALLERY.find((item) => item.src.endsWith("/" + file)),
    ),
    ...GALLERY.filter(
      (item) => !featured.some((file) => item.src.endsWith("/" + file)),
    ),
  ];
  const mosaic = document.getElementById("mosaic");
  const more = document.getElementById("galleryMore");
  function addPhoto(item, index) {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", "Ampliar foto: " + item.cap);
    const img = document.createElement("img");
    setResponsiveImage(
      img,
      item.src,
      "(max-width: 760px) calc((100vw - 50px) / 2), (max-width: 1320px) 30vw, 390px",
    );
    img.alt = item.cap;
    img.loading = "lazy";
    img.decoding = "async";
    const cap = document.createElement("span");
    cap.className = "cap";
    cap.textContent = item.cap;
    tile.append(img, cap);
    tile.addEventListener("click", () => openLightbox(gallery, index, tile));
    mosaic.append(tile);
  }
  gallery.slice(0, 6).forEach(addPhoto);
  more.hidden = false;
  more.addEventListener("click", () => {
    const expanded = more.getAttribute("aria-expanded") !== "true";
    if (expanded && mosaic.children.length === 6)
      gallery.slice(6).forEach((item, index) => addPhoto(item, index + 6));
    [...mosaic.children].forEach((tile, index) => {
      tile.hidden = !expanded && index >= 6;
    });
    more.setAttribute("aria-expanded", String(expanded));
    more.innerHTML = expanded
      ? 'Mostrar menos fotos <span aria-hidden="true">−</span>'
      : 'Ver todas as fotos <span aria-hidden="true">＋</span>';
    if (expanded) mosaic.children[6].focus({ preventScroll: true });
    else more.focus({ preventScroll: true });
  });

  // Explicit asset count avoids probing missing files; update when adding posters.
  const POSTER_COUNT = 13;
  const posters = Array.from({ length: POSTER_COUNT }, (_, index) => ({
    src:
      "assets/img/agendas/Agenda-" +
      String(POSTER_COUNT - index).padStart(3, "0") +
      ".png",
    cap: "SU7 · Cartaz de evento " + (POSTER_COUNT - index),
  }));
  const track = document.getElementById("agendaTrack");
  const counter = document.getElementById("agendaCounter");
  let posterIndex = 0;
  const slides = posters.map((poster, index) => {
    const slide = document.createElement("button");
    slide.className = "agenda-slide";
    slide.type = "button";
    slide.setAttribute("aria-label", "Ampliar " + poster.cap);
    const img = document.createElement("img");
    img.alt = poster.cap;
    img.decoding = "async";
    img.loading = "lazy";
    slide.append(img);
    slide.addEventListener("click", () => openLightbox(posters, index, slide));
    track.append(slide);
    return slide;
  });
  function showPoster(nextIndex) {
    posterIndex = (nextIndex + posters.length) % posters.length;
    track.style.transform = "translateX(" + -posterIndex * 100 + "%)";
    slides.forEach((slide, index) => {
      slide.inert = index !== posterIndex;
      slide.setAttribute("aria-hidden", String(index !== posterIndex));
      if (index === posterIndex)
        setResponsiveImage(
          slide.querySelector("img"),
          posters[index].src,
          "(max-width: 760px) 340px, 310px",
        );
    });
    counter.textContent =
      String(posterIndex + 1).padStart(2, "0") + " / " + posters.length;
  }
  document
    .querySelector(".agenda-nav--prev")
    .addEventListener("click", () => showPoster(posterIndex - 1));
  document
    .querySelector(".agenda-nav--next")
    .addEventListener("click", () => showPoster(posterIndex + 1));
  showPoster(0);

  // Shared accessible viewer for photos and posters.
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCap");
  const close = document.getElementById("lbClose");
  const previous = document.getElementById("lbPrev");
  const next = document.getElementById("lbNext");
  const background = [...document.body.children].filter(
    (element) => element !== lightbox && element.tagName !== "SCRIPT",
  );
  let lightboxItems = [];
  let lightboxIndex = 0;
  let trigger = null;
  function showImage(index) {
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[lightboxIndex];
    setResponsiveImage(lbImage, item.src, "90vw");
    document.getElementById("lbOriginal").href = item.src;
    lbImage.alt = item.cap;
    lbCaption.textContent =
      item.cap + " · " + (lightboxIndex + 1) + " / " + lightboxItems.length;
  }
  function openLightbox(items, index, opener) {
    trigger = opener;
    lightboxItems = items;
    showImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    close.focus();
    background.forEach((element) => {
      element.inert = true;
    });
  }
  function closeLightbox() {
    background.forEach((element) => {
      element.inert = false;
    });
    lightbox.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    if (trigger) trigger.focus({ preventScroll: true });
    lightbox.setAttribute("aria-hidden", "true");
  }
  close.addEventListener("click", closeLightbox);
  previous.addEventListener("click", () => showImage(lightboxIndex - 1));
  next.addEventListener("click", () => showImage(lightboxIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(lightboxIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(lightboxIndex - 1);
    }
    if (event.key === "Tab") {
      const controls = [
        close,
        previous,
        next,
        document.getElementById("lbOriginal"),
      ];
      const index = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[
        (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length
      ].focus();
    }
  });
})();

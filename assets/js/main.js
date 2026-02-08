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
  }

  function toggleMenu() {
    const isOpen = document.body.classList.toggle("menu-open");
    setExpanded(isOpen);
  }

  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  // Fecha menu ao clicar num link (mobile)
  if (nav) {
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeMenu();
    });
  }

  // Marcar item ativo conforme scroll
  const links = Array.from(document.querySelectorAll(".nav-link"))
    .filter(a => a.getAttribute("href") && a.getAttribute("href").startsWith("#"));

  const targets = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove("is-active"));
      const id = "#" + entry.target.id;
      const active = links.find(l => l.getAttribute("href") === id);
      if (active) active.classList.add("is-active");
    });
  }, { root: null, threshold: 0.6 });

  targets.forEach(t => obs.observe(t));

  // Fake submit (você liga em backend depois)
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      console.log("Contato:", data);

      alert("Mensagem registrada! (Ligue esse formulário em um serviço tipo Formspree/Netlify depois.)");
      form.reset();
    });
  }

  // Fecha menu ao apertar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

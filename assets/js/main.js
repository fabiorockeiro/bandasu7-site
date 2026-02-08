(() => {
  const $ = (q) => document.querySelector(q);

  // Ano automático
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Menu mobile
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.hasAttribute("hidden");
      if (isOpen) {
        mobileMenu.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      } else {
        mobileMenu.removeAttribute("hidden");
        menuBtn.setAttribute("aria-expanded", "true");
      }
    });

    // Fecha ao clicar em links
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileMenu.setAttribute("hidden", "");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Copiar presskit (troque pelo seu link real)
  const presskitUrl = "https://seusite.com/presskit";
  const copyBtn = $("#copyPresskit");
  const copyMsg = $("#copyMsg");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(presskitUrl);
        if (copyMsg) copyMsg.textContent = "Link do presskit copiado!";
      } catch (e) {
        if (copyMsg) copyMsg.textContent = "Não foi possível copiar automaticamente. Copie manualmente: " + presskitUrl;
      }
      setTimeout(() => { if (copyMsg) copyMsg.textContent = ""; }, 3500);
    });
  }

  // Formulário: por padrão abre WhatsApp com a mensagem (simples e funciona em static hosting)
  const form = $("#contactForm");
  const formMsg = $("#formMsg");

  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const data = new FormData(form);
      const nome = (data.get("nome") || "").toString().trim();
      const whatsapp = (data.get("whatsapp") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const cidade = (data.get("cidade") || "").toString().trim();
      const mensagem = (data.get("mensagem") || "").toString().trim();

      const text =
`Olá! Quero levar a banda para a minha cidade.
Nome: ${nome}
WhatsApp: ${whatsapp}
E-mail: ${email}
Cidade/UF: ${cidade}
Mensagem: ${mensagem || "(sem mensagem)"}
`;

      // Troque pelo WhatsApp da produção (DDI+DDD+numero, só dígitos)
      const phone = "5565999999999";

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");

      if (formMsg) formMsg.textContent = "Abrindo WhatsApp com sua solicitação…";
      form.reset();
      setTimeout(() => { if (formMsg) formMsg.textContent = ""; }, 3500);
    });
  }
})();

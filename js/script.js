/* ============================================================
   PORTFÓLIO — Guilherme Menezes Pereira
   Funcionalidades: links sociais, tema claro/escuro, menu mobile,
   animações ao rolar, destaque do menu ativo e formulário de contato.
============================================================ */

/* ------------------------------------------------------------
   LINKS SOCIAIS — edite apenas as URLs abaixo.
   Para o WhatsApp, use o formato: https://wa.me/55DDDNUMERO
------------------------------------------------------------ */
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/guilherme-menezess/?locale=pt-BR",
  github: "https://github.com/guilhermemzs",
  whatsapp: "https://wa.me/5531998402007",
};

// Aplica as URLs em todos os botões marcados com data-link
document.querySelectorAll("[data-link]").forEach((el) => {
  const url = SOCIAL_LINKS[el.dataset.link];
  if (url) el.href = url;
});

/* ------------------------------------------------------------
   TEMA CLARO / ESCURO
   Preferência salva em localStorage; padrão segue o sistema.
------------------------------------------------------------ */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = savedTheme || (systemDark ? "dark" : "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  });
}

/* ------------------------------------------------------------
   NAVBAR — sombra ao rolar e menu mobile
------------------------------------------------------------ */
const navbar = document.getElementById("navbar");
const navBurger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");

if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  });
}

if (navBurger && navLinks) {
  navBurger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navBurger.classList.toggle("is-open", open);
    navBurger.setAttribute("aria-expanded", open);
  });

  // Fecha o menu mobile ao clicar em um link
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("is-open");
      navBurger.classList.remove("is-open");
      navBurger.setAttribute("aria-expanded", "false");
    }
  });
}

/* ------------------------------------------------------------
   ANIMAÇÕES AO ROLAR — revela elementos .reveal ao entrarem na tela
------------------------------------------------------------ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------------------
   DESTAQUE DO LINK ATIVO NO MENU conforme a seção visível
------------------------------------------------------------ */
const sections = document.querySelectorAll("main section[id]");
const menuLinks = document.querySelectorAll(".navbar__links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        menuLinks.forEach((link) =>
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          )
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ------------------------------------------------------------
   FORMULÁRIO DE CONTATO
   Sem backend: monta um e-mail preenchido e abre o cliente padrão.
------------------------------------------------------------ */
const form = document.getElementById("contactForm");
const formHint = document.getElementById("formHint");

if (form && formHint) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !mensagem) {
      formHint.textContent = "Por favor, preencha todos os campos.";
      return;
    }

    const assunto = encodeURIComponent(`Contato pelo portfólio — ${nome}`);
    const corpo = encodeURIComponent(
      `Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`
    );

    window.location.href = `mailto:guilhermemp903@gmail.com?subject=${assunto}&body=${corpo}`;
    formHint.textContent = "Abrindo seu aplicativo de e-mail...";
    form.reset();
  });
}

/* ------------------------------------------------------------
   ANO ATUAL NO RODAPÉ
------------------------------------------------------------ */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

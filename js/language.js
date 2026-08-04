/* ============================================================
   SELETOR DE IDIOMA
   Mantém cada página ligada à sua versão equivalente em PT/EN.
============================================================ */

const LANGUAGE_ROUTES = {
  "/": { pt: "/", en: "/en/" },
  "/en/": { pt: "/", en: "/en/" },
  "/certificados/": { pt: "/certificados/", en: "/en/certificates/" },
  "/en/certificates/": { pt: "/certificados/", en: "/en/certificates/" },
  "/artigos/": { pt: "/artigos/", en: "/en/articles/" },
  "/en/articles/": { pt: "/artigos/", en: "/en/articles/" },
  "/artigos/beneficios-aprender-segunda-lingua/": {
    pt: "/artigos/beneficios-aprender-segunda-lingua/",
    en: "/en/articles/benefits-of-learning-a-second-language/",
  },
  "/en/articles/benefits-of-learning-a-second-language/": {
    pt: "/artigos/beneficios-aprender-segunda-lingua/",
    en: "/en/articles/benefits-of-learning-a-second-language/",
  },
  "/artigos/cambridge-c1-advanced/": {
    pt: "/artigos/cambridge-c1-advanced/",
    en: "/en/articles/cambridge-c1-advanced/",
  },
  "/en/articles/cambridge-c1-advanced/": {
    pt: "/artigos/cambridge-c1-advanced/",
    en: "/en/articles/cambridge-c1-advanced/",
  },
  "/artigos/engenharia-diagnostica-acessibilidade/": {
    pt: "/artigos/engenharia-diagnostica-acessibilidade/",
    en: "/en/articles/building-diagnostic-engineering-accessibility/",
  },
  "/en/articles/building-diagnostic-engineering-accessibility/": {
    pt: "/artigos/engenharia-diagnostica-acessibilidade/",
    en: "/en/articles/building-diagnostic-engineering-accessibility/",
  },
  "/demo-escala/": { pt: "/demo-escala/", en: "/en/schedule-demo/" },
  "/en/schedule-demo/": { pt: "/demo-escala/", en: "/en/schedule-demo/" },
};

const normalizeLanguagePath = (pathname) => {
  const withoutIndex = pathname.replace(/index\.html$/, "");
  return withoutIndex.endsWith("/") ? withoutIndex : `${withoutIndex}/`;
};

const languagePath = normalizeLanguagePath(window.location.pathname);
const languageRoute = LANGUAGE_ROUTES[languagePath];

if (languageRoute) {
  const currentLanguage = document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "pt";
  const labels = currentLanguage === "en"
    ? { group: "Select language", pt: "Português", en: "English" }
    : { group: "Selecionar idioma", pt: "Português", en: "English" };

  const switcher = document.createElement("nav");
  switcher.className = "language-switcher";
  switcher.setAttribute("aria-label", labels.group);

  ["pt", "en"].forEach((language) => {
    const link = document.createElement("a");
    link.href = `${languageRoute[language]}${window.location.hash}`;
    link.textContent = language.toUpperCase();
    link.title = labels[language];
    link.setAttribute("aria-label", labels[language]);
    link.lang = language === "pt" ? "pt-BR" : "en";

    if (language === currentLanguage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    switcher.appendChild(link);
  });

  const navbarActions = document.querySelector(".navbar__actions");
  const demoBannerLink = document.querySelector(".demo-banner > a");

  if (navbarActions) {
    navbarActions.prepend(switcher);
  } else if (demoBannerLink) {
    demoBannerLink.before(switcher);
  }
}

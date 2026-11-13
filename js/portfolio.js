// Keep incoming bookmarks from the original one-page portfolio usable.
const homePaths = ["/", "/index.html", "/en/", "/en/index.html"];
const profileSections = ["sobre", "experiencia", "formacao", "habilidades", "diferenciais"];
function followProfileBookmark() {
  const section = location.hash.slice(1);
  if (homePaths.includes(location.pathname) && profileSections.includes(section)) {
    const profile = document.documentElement.lang === "en" ? "/en/about/" : "/sobre/";
    location.replace(profile + "#" + (section === "diferenciais" ? "habilidades" : section));
  }
}
followProfileBookmark();
window.addEventListener("hashchange", followProfileBookmark);

const motion = matchMedia("(prefers-reduced-motion: no-preference)");
if (motion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("appeared");
        observer.unobserve(entry.target);
      }
    }
  }, {threshold: 0.09});
  document.querySelectorAll(".case-link, .story figure, .gallery figure").forEach(el => observer.observe(el));
  const cards = document.querySelectorAll(".case-panel");
  let queued = false;
  function updateImages() {
    const h = window.innerHeight;
    cards.forEach(card => {
      const bounds = card.getBoundingClientRect();
      if (bounds.bottom >= 0 && bounds.top <= h) {
        const progress = 1 - (bounds.top + bounds.height) / (h + bounds.height);
        card.style.setProperty("--lift", (12 - 12 * progress) + "px");
      }
    });
    queued = false;
  }
  if (cards.length) {
    window.addEventListener("scroll", () => {
      if (!queued && motion.matches) {
        queued = true;
        requestAnimationFrame(updateImages);
      }
    }, {passive:true});
    updateImages();
  }
}
const mobileMenu = document.querySelector(".mobile-menu");
if (mobileMenu) {
  document.addEventListener("click", event => {
    if (mobileMenu.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileMenu.open) {
      mobileMenu.open = false;
      mobileMenu.querySelector("summary").focus();
    }
  });
}

const contact = document.querySelector("#contactForm");
if (contact) {
  contact.addEventListener("submit", event => {
    event.preventDefault();
    const fields = new FormData(contact);
    const name = String(fields.get("nome")).trim();
    const address = String(fields.get("email")).trim();
    const message = String(fields.get("mensagem")).trim();
    const english = document.documentElement.lang === "en";
    const subject = (english ? "Portfolio contact — " : "Contato pelo portfólio — ") + name;
    const body = (english ? "Name: " : "Nome: ") + name + "\nE-mail: " + address + "\n\n" + message;
    location.href = "mailto:guilhermemp903@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    contact.querySelector('[role="status"]').textContent = english ? "Opening your email app…" : "Abrindo seu aplicativo de e-mail…";
  });
}

(() => {
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  const homePaths = ['/', '/index.html', '/en/', '/en/index.html'];
  const profileSections = ['sobre', 'experiencia', 'formacao', 'habilidades', 'diferenciais'];
  const cache = new Map();
  let disposePage = () => {};
  let navigation = 0;
  let controller;
  let animations = [];
  let renderedURL = location.href;

  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.setAttribute('aria-hidden', 'true');
  loader.innerHTML = '<div class="loader-content"><div class="loader-dots"><span></span><span></span><span></span></div><p></p></div>';
  document.body.append(loader);
  const status = document.createElement('div');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  document.body.append(status);

  function initPage() {
    disposePage();
    const cleanup = [];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (motion.matches) entry.target.classList.add('appeared');
            observer.unobserve(entry.target);
          }
        }
      }, {threshold: 0.09});
      document.querySelectorAll('.case-link, .story figure, .gallery figure').forEach(el => observer.observe(el));
      cleanup.push(() => observer.disconnect());
    }
    const cards = document.querySelectorAll('.case-panel');
    let frame = 0;
    const updateImages = () => {
      frame = 0;
      if (!motion.matches) return;
      cards.forEach(card => {
        const bounds = card.getBoundingClientRect();
        if (bounds.bottom >= 0 && bounds.top <= innerHeight) {
          const progress = 1 - (bounds.top + bounds.height) / (innerHeight + bounds.height);
          card.style.setProperty('--lift', `${12 - 12 * progress}px`);
        }
      });
    };
    if (cards.length) {
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateImages); };
      window.addEventListener('scroll', onScroll, {passive: true});
      cleanup.push(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); });
      updateImages();
    }
    const contact = document.querySelector('#contactForm');
    if (contact) contact.addEventListener('submit', event => {
      event.preventDefault();
      const fields = new FormData(contact);
      const english = document.documentElement.lang === 'en';
      const name = String(fields.get('nome')).trim();
      const address = String(fields.get('email')).trim();
      const message = String(fields.get('mensagem')).trim();
      const subject = (english ? 'Portfolio contact — ' : 'Contato pelo portfólio — ') + name;
      const body = (english ? 'Name: ' : 'Nome: ') + name + '\nE-mail: ' + address + '\n\n' + message;
      location.href = 'mailto:guilhermemp903@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      contact.querySelector('[role="status"]').textContent = english ? 'Opening your email app…' : 'Abrindo seu aplicativo de e-mail…';
    });
    disposePage = () => cleanup.forEach(fn => fn());
  }

  function portfolioURL(url) {
    return url.origin === location.origin && !url.search &&
      !/^\/(demo-escala|en\/schedule-demo)(\/|$)/.test(url.pathname) &&
      !/\.[^/]+$/.test(url.pathname.replace(/\/index\.html$/, '/'));
  }

  async function loadPage(url, signal) {
    const key = url.origin + url.pathname;
    let html = cache.get(key);
    if (!html) {
      const response = await fetch(key, {signal});
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Page unavailable');
      html = await response.text();
    }
    const page = new DOMParser().parseFromString(html, 'text/html');
    if (!page.querySelector('main#main') || !page.querySelector('script[src="/js/portfolio.js"]')) throw new Error('Use native navigation');
    cache.set(key, html);
    if (cache.size > 12) cache.delete(cache.keys().next().value);
    return page;
  }

  function delay(milliseconds, signal) {
    return new Promise(resolve => {
      const done = () => { clearTimeout(timer); signal?.removeEventListener('abort', done); resolve(); };
      const timer = setTimeout(done, milliseconds);
      if (signal?.aborted) done();
      else signal?.addEventListener('abort', done, {once: true});
    });
  }

  async function preparePage(url, signal) {
    const page = await loadPage(url, signal);
    // Decode the first visible photograph before revealing the new page.
    const firstPhoto = page.querySelector('.story img, .gallery.hero-photo img');
    if (firstPhoto && !signal.aborted) {
      const photo = new Image();
      photo.src = new URL(firstPhoto.getAttribute('src'), url).href;
      await Promise.race([photo.decode().catch(() => {}), delay(900, signal)]);
    }
    return page;
  }

  function animatePage(enter) {
    // Reduced motion still gets a short dissolve, without sliding or blurring.
    const frames = !motion.matches
      ? (enter ? [{opacity: 0}, {opacity: 1}] : [{opacity: 1}, {opacity: 0}])
      : (enter
        ? [{opacity: 0, transform: 'translateY(24px)'}, {opacity: 1, transform: 'translateY(0)'}]
        : [{opacity: 1, transform: 'translateY(0)'}, {opacity: 0, transform: 'translateY(-12px)'}]);
    animations = [...document.querySelectorAll('main, body > footer')].map(el => el.animate(frames, {
      duration: motion.matches ? (enter ? 680 : 280) : (enter ? 360 : 180),
      easing: enter ? 'cubic-bezier(.22,1,.36,1)' : 'ease-in-out', fill: 'both'
    }));
    return Promise.all(animations.map(animation => animation.finished.catch(() => {})));
  }

  function stopAnimations() {
    animations.forEach(animation => animation.cancel());
    animations = [];
  }

  function syncHeader(page) {
    // Retain the navigation element so the active pill and its light can glide.
    const tabs = document.querySelector('.tabs');
    const incoming = page.querySelector('.tabs');
    tabs.setAttribute('aria-label', incoming.getAttribute('aria-label'));
    [...tabs.children].forEach((link, index) => {
      const replacement = incoming.children[index];
      [...link.attributes].forEach(attr => link.removeAttribute(attr.name));
      [...replacement.attributes].forEach(attr => link.setAttribute(attr.name, attr.value));
      link.innerHTML = replacement.innerHTML;
    });
    tabs.style.removeProperty('--tab');
    for (const selector of ['.identity', '.head-links', '.mobile-menu', '.skip']) {
      document.querySelector(selector)?.replaceWith(document.importNode(page.querySelector(selector), true));
    }
  }

  function scrollToPage(url, scroll) {
    if (scroll) window.scrollTo({left: scroll.x, top: scroll.y, behavior: 'instant'});
    else if (url.hash) {
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) target.scrollIntoView({behavior: 'instant'});
      else window.scrollTo({top: 0, behavior: 'instant'});
    } else window.scrollTo({top: 0, behavior: 'instant'});
  }

  async function navigate(url, {pop = false, scroll = null, replace = false} = {}) {
    const id = ++navigation;
    controller?.abort();
    controller = new AbortController();
    const requestController = controller;
    stopAnimations();
    const menu = document.querySelector('.mobile-menu');
    if (menu) menu.open = false;
    status.textContent = document.documentElement.lang === 'en' ? 'Loading…' : 'Carregando…';
    document.querySelector('main').setAttribute('aria-busy', 'true');
    document.querySelector('main').inert = true;
    document.querySelector('body > footer').inert = true;
    document.body.classList.add('is-navigating');
    document.body.dataset.navigationPhase = 'leaving';
    loader.querySelector('p').textContent = document.documentElement.lang === 'en' ? 'Just a moment.' : 'Um instante.';
    loader.classList.add('visible');
    const timeout = setTimeout(() => requestController.abort(), 10000);
    const targetTab = /\/(sobre|about|certificados|certificates)(\/|$)/.test(url.pathname) ? 1 : 0;
    document.querySelector('.tabs').style.setProperty('--tab', targetTab);
    try {
      const leaving = animatePage(false).then(() => {
        if (id === navigation) document.body.dataset.navigationPhase = 'loading';
      });
      const [page] = await Promise.all([
        preparePage(url, requestController.signal), leaving,
        delay(motion.matches ? 420 : 280, requestController.signal)
      ]);
      if (id !== navigation) return;
      clearTimeout(timeout);
      if (!pop) {
        history.replaceState({...history.state, scroll: {x: scrollX, y: scrollY}}, '', renderedURL);
        history[replace ? 'replaceState' : 'pushState']({portfolio: true}, '', url);
      }
      renderedURL = url.href;
      // Update the address before inserting relative document and image links.
      document.documentElement.lang = page.documentElement.lang;
      const metadata = 'title, meta, link[rel="canonical"], link[rel="alternate"], script[type="application/ld+json"]';
      document.head.querySelectorAll(metadata).forEach(el => el.remove());
      page.head.querySelectorAll(metadata).forEach(el => document.head.append(document.importNode(el, true)));
      syncHeader(page);
      document.querySelector('main').replaceWith(document.importNode(page.querySelector('main'), true));
      document.querySelector('body > footer').replaceWith(document.importNode(page.querySelector('footer'), true));
      stopAnimations();
      scrollToPage(url, scroll);
      initPage();
      const main = document.querySelector('main');
      main.dataset.transitioned = '';
      main.setAttribute('tabindex', '-1');
      main.focus({preventScroll: true});
      document.body.dataset.navigationPhase = 'entering';
      loader.classList.remove('visible');
      await animatePage(true);
      if (id !== navigation) return;
      status.textContent = document.title;
    } catch (error) {
      if (id !== navigation) return;
      // Normal document visits remain the fallback for network or parsing failures.
      if (pop || replace) location.replace(url.href);
      else location.assign(url.href);
    } finally {
      clearTimeout(timeout);
      if (id === navigation) {
        stopAnimations();
        loader.classList.remove('visible');
        document.body.classList.remove('is-navigating');
        delete document.body.dataset.navigationPhase;
        document.querySelector('main').removeAttribute('aria-busy');
        document.querySelector('main').inert = false;
        document.querySelector('body > footer').inert = false;
      }
    }
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (!portfolioURL(url)) return;
    const current = new URL(renderedURL);
    if (url.pathname === current.pathname && url.hash) return;
    event.preventDefault();
    if (url.href === renderedURL) {
      if (!document.body.classList.contains('is-navigating')) scrollToPage(url);
      else navigate(url);
      return;
    }
    navigate(url);
  });

  // Preload just the primary destinations, without downloading the whole archive.
  const prefetch = event => {
    const link = event.target.closest('.tabs a');
    if (!link || navigator.connection?.saveData) return;
    const url = new URL(link.href);
    if (portfolioURL(url)) loadPage(url).catch(() => {});
  };
  document.addEventListener('pointerover', prefetch);
  document.addEventListener('focusin', prefetch);
  document.addEventListener('click', event => {
    const menu = document.querySelector('.mobile-menu');
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    const menu = document.querySelector('.mobile-menu');
    if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  history.scrollRestoration = 'manual';
  history.replaceState({...history.state, portfolio: true}, '', location.href);
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (!document.body.classList.contains('is-navigating')) {
        history.replaceState({...history.state, scroll: {x: scrollX, y: scrollY}}, '', location.href);
      }
    });
  }, {passive: true});
  window.addEventListener('popstate', event => {
    const url = new URL(location.href);
    if (url.pathname === new URL(renderedURL).pathname && !document.body.classList.contains('is-navigating')) {
      renderedURL = url.href;
      scrollToPage(url, event.state?.scroll);
    } else navigate(url, {pop: true, scroll: event.state?.scroll});
  });
  function followProfileBookmark() {
    const section = location.hash.slice(1);
    if (homePaths.includes(location.pathname) && profileSections.includes(section)) {
      const profile = document.documentElement.lang === 'en' ? '/en/about/' : '/sobre/';
      navigate(new URL(profile + '#' + (section === 'diferenciais' ? 'habilidades' : section), location.origin), {replace: true});
    }
  }
  window.addEventListener('hashchange', () => { renderedURL = location.href; followProfileBookmark(); });
  motion.addEventListener('change', () => {
    if (!motion.matches) { stopAnimations(); loader.classList.remove('visible'); }
  });
  initPage();
  followProfileBookmark();
})();

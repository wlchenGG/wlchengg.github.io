(function () {
  const DEFAULT_THEME = 'pixel';
  const THEME_KEY = 'gameTheme';

  const scriptSrc = document.currentScript ? document.currentScript.src : '';
  const basePath = scriptSrc ? scriptSrc.replace(/[^/]+$/, '') : './';

  function themeHref(theme) {
    return `${basePath}themes/${theme}.css`;
  }

  function applyTheme(theme) {
    const normalized = theme || DEFAULT_THEME;
    localStorage.setItem(THEME_KEY, normalized);

    const existing = document.getElementById('game-theme-link');
    if (existing) {
      existing.href = themeHref(normalized);
    } else {
      const link = document.createElement('link');
      link.id = 'game-theme-link';
      link.rel = 'stylesheet';
      link.href = themeHref(normalized);
      document.head.appendChild(link);
    }
    document.documentElement.setAttribute('data-theme', normalized);
  }

  function init() {
    const params = new URLSearchParams(location.search);
    const paramTheme = params.get('theme');
    const saved = localStorage.getItem(THEME_KEY);
    const theme = (paramTheme || saved || DEFAULT_THEME).toLowerCase();

    applyTheme(theme);

    // 清除 URL 中的 theme 参数，避免链接污染
    if (paramTheme) {
      params.delete('theme');
      const query = params.toString();
      const newUrl = location.pathname + (query ? `?${query}` : '') + location.hash;
      history.replaceState({}, '', newUrl);
    }
  }

  window.__setGameTheme = applyTheme;
  window.__getGameTheme = function () {
    return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  };

  init();
})();

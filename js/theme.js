/* 深色 / 浅色主题切换：统一使用全屏遮罩，避免不同浏览器渲染不同步。 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hcl-theme';
  var root = document.documentElement;
  var themeColor = document.querySelector('meta[name="theme-color"]');

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function apply(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'light' ? '#f6f7f4' : '#0e0f12');
    }
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
  }

  apply(getStored());

  var btn = document.getElementById('themeToggle');
  if (!btn) { return; }

  var busy = false;
  var layer = null;

  function ensureLayer() {
    if (layer) { return layer; }
    layer = document.createElement('div');
    layer.className = 'theme-fade-layer';
    document.body.appendChild(layer);
    return layer;
  }

  function switchTheme(next) {
    var l = ensureLayer();
    var currentBackground = getComputedStyle(document.body).backgroundColor;
    l.style.backgroundColor = currentBackground;
    l.style.transition = 'none';
    l.style.opacity = '1';
    l.getBoundingClientRect();

    root.classList.add('theme-switching');
    apply(next);
    l.style.transition = '';
    l.style.opacity = '0';

    setTimeout(function () {
      root.classList.remove('theme-switching');
      if (l.parentNode) {
        l.parentNode.removeChild(l);
      }
      layer = null;
      busy = false;
    }, 320);
  }

  btn.addEventListener('click', function () {
    if (busy) { return; }
    busy = true;

    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) { /* 忽略隐私模式下的写入失败 */ }

    switchTheme(next);
  });
})();

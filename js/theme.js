/* 深色 / 浅色 / 跟随系统主题切换：统一使用全屏遮罩，避免不同浏览器渲染不同步。
   顶栏按钮与设置页的主题选项共用同一套逻辑。 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hcl-theme';
  var MODES = ['dark', 'light', 'system'];
  var root = document.documentElement;
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  var busy = false;
  var layer = null;

  /* 存储里只认 dark / light / system 三种值，其余（含尚未设置）按 dark 处理 */
  function readMode() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return MODES.indexOf(v) > -1 ? v : 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  function systemTheme() {
    return media && media.matches ? 'light' : 'dark';
  }

  var mode = readMode();

  /* 实际生效的外观：跟随系统时取系统偏好，否则就是设置本身 */
  function resolve(m) {
    return m === 'system' ? systemTheme() : m;
  }

  function current() {
    return resolve(mode);
  }

  function syncControls() {
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', current() === 'light' ? 'true' : 'false');
    }
    var opts = document.querySelectorAll('[data-theme-option]');
    for (var i = 0; i < opts.length; i++) {
      var on = opts[i].getAttribute('data-theme-option') === mode;
      opts[i].classList.toggle('is-active', on);
      opts[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function paint() {
    if (current() === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (themeColor) {
      themeColor.setAttribute('content', current() === 'light' ? '#f4f6fa' : '#0d0e11');
    }
    syncControls();
  }

  function apply(next) {
    mode = next;
    paint();
  }

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

  /* animate 传 false 时直接换主题，不播遮罩过渡（用于页面初始化） */
  function setTheme(next, animate) {
    if (MODES.indexOf(next) === -1) { return; }
    if (next === mode) { return; }
    if (busy && animate !== false) { return; }

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) { /* 忽略隐私模式下的写入失败 */ }

    /* 换了设置但外观没变（例如浅色 → 跟随系统且系统就是浅色），不必播过渡 */
    if (animate === false || resolve(next) === current()) {
      apply(next);
      return;
    }

    busy = true;
    switchTheme(next);
  }

  /* 系统外观变化时，只有「跟随系统」需要跟着重绘 */
  function onSystemChange() {
    if (mode !== 'system' || busy) { return; }
    paint();
  }

  if (media) {
    if (media.addEventListener) {
      media.addEventListener('change', onSystemChange);
    } else if (media.addListener) {
      media.addListener(onSystemChange);
    }
  }

  paint();

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(current() === 'light' ? 'dark' : 'light');
    });
  }

  var opts = document.querySelectorAll('[data-theme-option]');
  for (var i = 0; i < opts.length; i++) {
    opts[i].addEventListener('click', function () {
      setTheme(this.getAttribute('data-theme-option'));
    });
  }

  window.HCLTheme = { get: current, getMode: function () { return mode; }, set: setTheme };
})();

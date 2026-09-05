/* 深色 / 浅色主题切换：
   优先用 View Transitions API（整页截图交叉淡入淡出，导航栏与正文绝对同步）；
   不支持的浏览器回退到"遮罩暗场"过渡。 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hcl-theme';
  var root = document.documentElement;

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

  function fallbackSwitch(next) {
    var l = ensureLayer();
    l.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
    l.style.transition = 'none';
    l.style.opacity = '0';
    l.getBoundingClientRect();
    l.style.transition = '';
    l.style.opacity = '1';

    root.classList.add('theme-dipping');

    setTimeout(function () {
      apply(next);
      ensureLayer().style.opacity = '0';
      setTimeout(function () {
        root.classList.remove('theme-dipping');
        var l2 = ensureLayer();
        l2.style.backgroundColor = 'transparent';
        l2.style.opacity = '0';
        busy = false;
      }, 240);
    }, 200);
  }

  function viewTransitionSwitch(next) {
    var done = false;
    var finish = function () {
      if (!done) { done = true; busy = false; }
    };

    /* 标准用法：在 update 回调里直接 apply，浏览器自动截取旧/新两张图 */
    var vt = document.startViewTransition(function () {
      apply(next);
    });

    if (vt && vt.finished) {
      vt.finished.then(finish).catch(finish);
    } else {
      finish();
    }

    /* 兜底：最多 600ms 后解除锁定 */
    setTimeout(finish, 600);
  }

  btn.addEventListener('click', function () {
    if (busy) { return; }
    busy = true;

    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) { /* 忽略隐私模式下的写入失败 */ }

    if (typeof document.startViewTransition === 'function') {
      root.classList.add('theme-switching');
      viewTransitionSwitch(next);
      /* 过渡结束后移除标记类 */
      setTimeout(function () {
        root.classList.remove('theme-switching');
      }, 700);
    } else {
      fallbackSwitch(next);
    }
  });
})();

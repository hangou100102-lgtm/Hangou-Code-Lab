/* 深色 / 浅色主题切换，偏好持久化到 localStorage */
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
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) { /* 忽略隐私模式下的写入失败 */ }
      apply(next);
    });
  }
})();

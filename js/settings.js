/* 设置页：Cookie 提示偏好。
   「不再提示」写入确认标记，之后不再弹出确认框；「每次询问」清掉标记，
   下次加载页面时重新弹出确认框。 */
(function () {
  'use strict';

  var KEY = 'hcl-cookie-ok';
  var options = document.querySelectorAll('[data-cookie-option]');
  if (!options.length) { return; }

  function getMode() {
    try {
      return localStorage.getItem(KEY) === '1' ? 'skip' : 'ask';
    } catch (err) {
      return 'ask';
    }
  }

  function sync(mode) {
    for (var i = 0; i < options.length; i++) {
      var on = options[i].getAttribute('data-cookie-option') === mode;
      options[i].classList.toggle('is-active', on);
      options[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function setMode(mode) {
    var next = mode === 'skip' ? 'skip' : 'ask';
    try {
      if (next === 'skip') {
        localStorage.setItem(KEY, '1');
      } else {
        localStorage.removeItem(KEY);
      }
    } catch (err) { /* 隐私模式下写不进去，只更新界面 */ }
    sync(next);
  }

  sync(getMode());

  for (var i = 0; i < options.length; i++) {
    options[i].addEventListener('click', function () {
      setMode(this.getAttribute('data-cookie-option'));
    });
  }
})();

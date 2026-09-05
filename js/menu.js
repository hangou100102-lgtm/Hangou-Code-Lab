/* 移动端导航抽屉：汉堡按钮开合，键盘焦点管理与滚动锁定 */
(function () {
  'use strict';

  var toggle = document.getElementById('menuToggle');
  var drawer = document.getElementById('navDrawer');
  var backdrop = document.getElementById('navDrawerBackdrop');
  var savedBodyPaddingRight = '';

  if (!toggle || !drawer || !backdrop) { return; }

  function getFocusable() {
    return Array.prototype.slice.call(drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function setDrawerAvailable(available) {
    drawer.setAttribute('aria-hidden', available ? 'false' : 'true');
    if (available) {
      drawer.removeAttribute('inert');
    } else {
      drawer.setAttribute('inert', '');
    }
  }

  function lockScroll() {
    savedBodyPaddingRight = document.body.style.paddingRight;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.classList.add('nav-open');
  }

  function unlockScroll() {
    document.body.style.paddingRight = savedBodyPaddingRight;
    document.body.classList.remove('nav-open');
  }

  function open() {
    setDrawerAvailable(true);
    drawer.classList.add('open');
    backdrop.classList.add('show');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    lockScroll();

    var focusable = getFocusable();
    if (focusable.length) { focusable[0].focus(); }
  }

  function close(restoreFocus) {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    setDrawerAvailable(false);
    unlockScroll();
    if (restoreFocus !== false) { toggle.focus(); }
  }

  setDrawerAvailable(false);

  toggle.addEventListener('click', function () {
    if (drawer.classList.contains('open')) {
      close(false);
    } else {
      open();
    }
  });

  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (!drawer.classList.contains('open')) { return; }

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }

    if (e.key !== 'Tab') { return; }
    var focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* 点抽屉内链接后自动收起；页面跳转时无需恢复旧页面焦点。 */
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) { close(false); }
  });
})();

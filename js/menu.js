/* 移动端导航抽屉：汉堡按钮开合，点遮罩或按 Esc 关闭 */
(function () {
  'use strict';

  var toggle = document.getElementById('menuToggle');
  var drawer = document.getElementById('navDrawer');
  var backdrop = document.getElementById('navDrawerBackdrop');

  if (!toggle || !drawer || !backdrop) { return; }

  function open() {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function close() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  toggle.addEventListener('click', function () {
    if (drawer.classList.contains('open')) {
      close();
    } else {
      open();
    }
  });

  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      close();
    }
  });

  /* 点抽屉内链接后自动收起 */
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) { close(); }
  });
})();

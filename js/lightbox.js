/* 文章内图片浮窗预览 + 下载：
   点击 .article-body 里的图片 → 全屏浮窗放大；支持 Esc / 点击遮罩关闭；浮窗内提供下载按钮。 */
(function () {
  'use strict';

  var imgs = document.querySelectorAll('.article-body img');
  if (!imgs.length) { return; }

  var overlay = null;

  function ensureOverlay() {
    if (overlay) { return; }
    overlay = document.createElement('div');
    overlay.className = 'lb';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '图片预览');
    overlay.innerHTML =
      '<button type="button" class="lb-close" aria-label="关闭预览">&times;</button>' +
      '<figure class="lb-figure">' +
        '<img class="lb-img" alt="" />' +
        '<figcaption class="lb-bar">' +
          '<a class="lb-download" href="#">下载图片</a>' +
        '</figcaption>' +
      '</figure>';
    document.body.appendChild(overlay);

    /* 点击遮罩（非图片/按钮区域）关闭 */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { close(); }
    });
    overlay.querySelector('.lb-close').addEventListener('click', close);
  }

  /* 锁定滚动时，用等宽内边距补偿消失的滚动条，避免页面左右位移 */
  var scrollLocked = false;
  var closeTimer = null;

  function lockScroll() {
    if (scrollLocked) { return; }
    scrollLocked = true;
    var sbw = window.innerWidth - document.documentElement.clientWidth;
    if (sbw > 0) {
      document.body.style.paddingRight = sbw + 'px';
    }
    document.body.classList.add('lb-lock');
  }

  function unlockScroll() {
    if (!scrollLocked) { return; }
    scrollLocked = false;
    document.body.style.paddingRight = '';
    document.body.classList.remove('lb-lock');
  }

  function open(img) {
    ensureOverlay();
    clearTimeout(closeTimer);
    var src = img.currentSrc || img.src;
    var name = src.split('/').pop().split('?')[0] || 'image';

    overlay.querySelector('.lb-img').src = src;
    overlay.querySelector('.lb-img').alt = img.alt || '';
    var dl = overlay.querySelector('.lb-download');
    dl.href = src;
    dl.setAttribute('download', name);

    lockScroll();
    overlay.classList.add('open');
  }

  function close() {
    if (!overlay) { return; }
    overlay.classList.remove('open');
    /* 等淡出动画结束（约 0.3s）再解锁滚动，避免关闭中途画面跳动 */
    clearTimeout(closeTimer);
    closeTimer = setTimeout(unlockScroll, 300);
  }

  imgs.forEach = imgs.forEach || function (fn) {
    for (var i = 0; i < imgs.length; i++) { fn(imgs[i], i); }
  };
  imgs.forEach(function (img) {
    img.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      open(img);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') { close(); }
  });
})();

/* 首屏加载遮罩：资源加载完成后淡出并移除。 */
(function () {
  'use strict';

  var loader = document.getElementById('pageLoader');
  if (!loader) { return; }

  var finished = false;

  function finish() {
    if (finished) { return; }
    finished = true;

    requestAnimationFrame(function () {
      loader.classList.add('is-loaded');
      setTimeout(function () {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 300);
    });
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
  }

  window.addEventListener('pageshow', finish);
})();

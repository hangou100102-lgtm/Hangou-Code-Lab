/* Cookie 确认弹窗：没确认过就弹出居中对话框并锁定页面滚动。
   「知道了」写入记录，之后不再出现；「取消」只关闭本次弹窗，
   下次加载还会再弹。 */
(function () {
  'use strict';

  var KEY = 'hcl-cookie-ok';
  var modal = document.getElementById('cookieTip');
  var btn = document.getElementById('cookieTipBtn');
  var cancel = document.getElementById('cookieTipCancel');
  if (!modal || !btn) { return; }

  var agreed = false;
  try { agreed = localStorage.getItem(KEY) === '1'; } catch (err) { /* 隐私模式下读不到，当作没确认 */ }

  if (agreed) { return; }

  modal.hidden = false;
  document.documentElement.classList.add('cookie-open');
  btn.focus({ preventScroll: true });

  function close() {
    modal.hidden = true;
    document.documentElement.classList.remove('cookie-open');
  }

  btn.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (err) { /* 存不下也不影响这次关闭 */ }
    close();
  });

  if (cancel) {
    cancel.addEventListener('click', close);
  }
})();

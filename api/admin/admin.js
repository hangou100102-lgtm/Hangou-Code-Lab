/* 后台登录页逻辑：同源请求，Cookie 自动携带，无跨域问题 */
(function () {
  'use strict';

  var form = document.getElementById('login-form');
  var panel = document.getElementById('admin-panel');
  var errorEl = document.getElementById('login-error');
  var nameEl = document.getElementById('admin-name');
  var logoutBtn = document.getElementById('logout-btn');

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function showPanel(username) {
    form.hidden = true;
    panel.hidden = false;
    nameEl.textContent = username;
  }

  function showLogin() {
    panel.hidden = true;
    form.hidden = false;
    sessionStorage.removeItem('admin_csrf');
  }

  /* 页面打开先探一下登录态 */
  fetch('me.php', { credentials: 'same-origin' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data && data.authed) {
        sessionStorage.setItem('admin_csrf', data.csrf || '');
        showPanel(data.username || '');
      }
    })
    .catch(function () { /* 探测失败就停在登录页 */ });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value;
    if (!username || !password) {
      showError('请填写用户名和密码');
      return;
    }

    var btn = form.querySelector('.admin-btn');
    btn.disabled = true;

    fetch('login.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(function (res) {
        return res.json().then(function (data) { return { status: res.status, data: data }; });
      })
      .then(function (r) {
        if (r.data && r.data.ok) {
          sessionStorage.setItem('admin_csrf', r.data.csrf || '');
          showPanel(r.data.username || username);
        } else {
          showError((r.data && r.data.error) || '登录失败，请稍后再试');
        }
      })
      .catch(function () { showError('网络错误，请稍后再试'); })
      .finally(function () { btn.disabled = false; });
  });

  logoutBtn.addEventListener('click', function () {
    fetch('logout.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-CSRF-Token': sessionStorage.getItem('admin_csrf') || '' }
    })
      .then(function () { showLogin(); })
      .catch(function () { showLogin(); });
  });
})();

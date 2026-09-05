/* 友链即时模糊搜索：按名称、简介和网址筛选友链卡片。 */
(function () {
  'use strict';

  var input = document.getElementById('friendSearchInput');
  var list = document.querySelector('.friend-list');
  var noResult = document.getElementById('friendNoResult');

  if (!input || !list) { return; }

  var items = Array.prototype.slice.call(list.querySelectorAll('.friend-item'));

  function tokenize(value) {
    return value.toLowerCase()
      .split(/[\s,，。.、;；:：!！?？'"“”‘’()（）\[\]{}<>《》\-_\/\\|·]+/)
      .filter(Boolean);
  }

  function matches(text, token) {
    if (text.indexOf(token) !== -1) { return true; }
    if (token.length <= 1) { return false; }

    var position = 0;
    for (var i = 0; i < text.length && position < token.length; i++) {
      if (text.charAt(i) === token.charAt(position)) { position += 1; }
    }
    return position === token.length;
  }

  function run() {
    var tokens = tokenize(input.value);
    var visible = 0;

    items.forEach(function (item) {
      var text = item.textContent.toLowerCase();
      var hit = tokens.every(function (token) { return matches(text, token); });
      item.hidden = !hit;
      if (hit) { visible += 1; }
    });

    if (noResult) { noResult.hidden = visible > 0; }
  }

  var composing = false;
  input.addEventListener('compositionstart', function () { composing = true; });
  input.addEventListener('compositionend', function () {
    composing = false;
    run();
  });
  input.addEventListener('input', function () {
    if (!composing) { run(); }
  });
})();

/* 首页文章即时过滤搜索 */
(function () {
  'use strict';

  var input = document.getElementById('searchInput');
  if (!input) { return; }

  var items = Array.prototype.slice.call(document.querySelectorAll('.post-item'));
  var noResult = document.getElementById('noResult');

  function run() {
    var q = input.value.trim().toLowerCase();
    var visible = 0;

    items.forEach(function (item) {
      var hit = q === '' || item.textContent.toLowerCase().indexOf(q) > -1;
      item.hidden = !hit;
      if (hit) { visible += 1; }
    });

    if (noResult) {
      noResult.hidden = visible > 0;
    }
  }

  input.addEventListener('input', run);
})();

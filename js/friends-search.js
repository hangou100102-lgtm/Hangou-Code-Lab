/* 友链页即时模糊搜索（与首页文章搜索 js/search.js 逻辑一致）：
   1. 支持多关键词（空格 / 中英文标点分隔），需全部命中；
   2. 每个关键词先做连续子串匹配，不中再按“字符顺序容错”模糊匹配（允许中间漏字/隔字）； */
(function () {
  'use strict';

  var input = document.getElementById('friendSearchInput');
  if (!input) { return; }

  var items = Array.prototype.slice.call(document.querySelectorAll('.friend-item'));
  var noResult = document.getElementById('friendNoResult');

  /* 把查询拆成关键词：去掉标点与空白，按任意分隔切分 */
  function tokenize(s) {
    return s.toLowerCase()
      .split(/[\s,，。.、;；:：!！?？'"“”‘’()（）\[\]{}<>《》\-_/\\|·]+/)
      .filter(Boolean);
  }

  /* 连续子串匹配 */
  function hasSubstring(text, tok) {
    return text.indexOf(tok) !== -1;
  }

  /* 容错模糊匹配：tok 的每个字符按顺序在 text 中出现即可（允许中间有其他字） */
  function fuzzyMatch(text, tok) {
    var i = 0;
    var n = tok.length;
    for (var j = 0; j < text.length && i < n; j++) {
      if (text.charAt(j) === tok.charAt(i)) { i++; }
    }
    return i === n;
  }

  /* 短关键词（1 个字符）用子串即可，避免模糊匹配把所有友链都搜出来 */
  function matchToken(text, tok) {
    if (tok.length <= 1) { return hasSubstring(text, tok); }
    return hasSubstring(text, tok) || fuzzyMatch(text, tok);
  }

  function run() {
    var toks = tokenize(input.value);
    var visible = 0;

    items.forEach(function (item) {
      var hit = toks.length === 0;
      if (toks.length > 0) {
        var text = (item._fullText || item.textContent).toLowerCase();
        hit = true;
        for (var k = 0; k < toks.length; k++) {
          if (!matchToken(text, toks[k])) { hit = false; break; }
        }
      }
      item.hidden = !hit;
      if (hit) { visible += 1; }
    });

    if (noResult) {
      noResult.hidden = visible > 0;
    }
  }

  /* 中文输入法组合输入期间不实时过滤，避免误清空 */
  var composing = false;
  input.addEventListener('compositionstart', function () { composing = true; });
  input.addEventListener('compositionend', function () { composing = false; run(); });
  input.addEventListener('input', function () {
    if (!composing) { run(); }
  });
})();

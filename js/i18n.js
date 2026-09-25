/* 界面语言：中文（默认）/ English。
   做法是「短语映射」：只扫描站点框架文案所在的容器（顶栏、抽屉、页脚、
   Cookie 提示，以及标了 data-i18n-scope 的区域），把命中的中文短语换成英文。
   文章正文不在扫描范围内，由全文翻译开关（article-lang.js）接管。 */
(function () {
  'use strict';

  var STORAGE_KEY = 'hcl-lang';
  var SCOPE_SELECTOR = '.site-header, .nav-drawer, .site-footer, .cookie-modal, [data-i18n-scope]';
  var ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];

  /* 中文短语 → 英文译文 */
  var ZH_TO_EN = {
    /* 顶栏与无障碍标签 */
    '主导航': 'Main navigation',
    '首页': 'Home',
    '文章': 'Articles',
    '归档': 'Archive',
    '友链': 'Links',
    '更多': 'More',
    '关于我': 'About',
    '更新日志': 'Changelog',
    '赞助': 'Sponsor',
    '设置': 'Settings',
    '切换主题': 'Toggle theme',
    '打开菜单': 'Open menu',
    /* 抽屉 */
    '移动端菜单': 'Mobile menu',
    'Hangou 头像': 'Hangou avatar',
    '博客': 'Blog',
    '友链列表': 'Friends',
    '爱发电': 'Aifadian',
    '爱发电赞助': 'Support on Aifadian',
    /* 页脚 */
    '欢迎在这些地方找到我：': 'Find me here:',
    '哔哩哔哩': 'Bilibili',
    'B站主页': 'Bilibili profile',
    'GitHub主页': 'GitHub profile',
    '爱发电主页': 'Aifadian profile',
    '© 2026 Hangou · Hangou Code Lab · 用一杯咖啡的时间，写下此刻的光。': '© 2026 Hangou · Hangou Code Lab · Writing down the light of this moment, one cup of coffee at a time.',
    /* Cookie 提示 */
    'Cookie 与本地存储确认': 'Cookie and local storage notice',
    '本站如何使用 Cookie': 'How this site uses cookies',
    '本站不设追踪型 Cookie，仅用浏览器本地存储记住主题偏好、翻页方向和本提示的确认状态，数据不出你的设备。详见': 'This site sets no tracking cookies. It only uses browser local storage to remember your theme preference, page direction and whether you dismissed this notice; nothing ever leaves your device. See ',
    '隐私政策': 'Privacy Policy',
    '。': '.',
    '取消': 'Cancel',
    '知道了': 'Got it',
    /* 首页 */
    '你好，这里是 Hangou Code Lab': 'Hi, this is Hangou Code Lab',
    '我是憨狗，写代码也做视频，这里放一些零零散散的想法。': 'I am Hangou. I write code and make videos, and this is where I keep scattered thoughts.',
    '最近写的东西': 'Recent writing',
    '全部文章': 'All posts',
    /* 文章列表 */
    '这里收录站内全部文章，支持标题、标签与摘要关键词搜索。': 'Every post on this site. Search by title, tag or excerpt keyword.',
    '搜索文章标题、标签或摘要…': 'Search titles, tags or excerpts…',
    '搜索文章': 'Search posts',
    '没有找到相关文章，换个关键词试试？': 'No matching posts. Try another keyword.',
    '文章列表': 'Articles',
    '最近文章': 'Recent posts',
    /* 标签 */
    '置顶': 'Pinned',
    '关于': 'About',
    /* 评论区 */
    '评论': 'Comments',
    /* 友链 */
    '友情链接': 'Friend Links',
    '搜索友链名称、简介或网址…': 'Search friend name, intro or URL…',
    '搜索友链': 'Search friends',
    '没有找到匹配的友链，换个关键词试试？': 'No matching friends. Try another keyword.',
    '咡如夏的头像': 'Avatar of 咡如夏',
    'Thinkreally 的头像': 'Avatar of Thinkreally',
    'Xiaobocm 的头像': 'Avatar of Xiaobocm',
    /* 赞助 */
    '支持 Hangou': 'Support Hangou',
    '支持创作': 'Support my work',
    '赞助支持': 'Support on Aifadian',
    '点击下面的按钮前往爱发电完成赞助。': 'Click the button below to sponsor me on Aifadian.',
    '前往爱发电赞助': 'Sponsor on Aifadian',
    '如果我的文章、项目或分享对你有帮助，欢迎通过爱发电支持我。每一份支持都会成为继续创作的动力。': 'If my posts, projects or sharing have been helpful, you are welcome to support me on Aifadian. Every bit of support keeps me creating.',
    '赞助列表': 'Sponsors',
    '赞助名单整理中，感谢每一位支持者～': 'The sponsor list is being put together. Thanks to everyone who supports.',
    /* 设置页 */
    '语言': 'Language',
    '切换界面语言。站内文字以中文撰写，可开启下方的全文翻译。': 'Switch the interface language. The site is written in Chinese; full-text translation can be turned on below.',
    '全文翻译': 'Full-text translation',
    '开启后，界面语言为 English 时，站内各处的文字都会显示英文版本；英文内容由 AI 辅助翻译，可能出现偏差，不保证 100% 正确。': 'When on, the text across the site is shown in an English version once the interface language is English. The English text is translated with AI assistance, so it may contain inaccuracies and is not guaranteed to be 100% correct.',
    '关闭': 'Off',
    '开启': 'On',
    '主题': 'Theme',
    '选择深色、浅色或跟随系统外观，与顶栏的切换按钮保持一致。': 'Pick a dark, light or system appearance. Kept in sync with the header toggle.',
    '深色': 'Dark',
    '浅色': 'Light',
    '跟随系统': 'System',
    'Cookie 提示': 'Cookie notice',
    '本站不设追踪型 Cookie，只在本机记住你的选择。': 'This site sets no tracking cookies and only remembers your choice on this device.',
    '每次询问': 'Ask every time',
    '不再提示': 'Do not ask again',
    '设置保存在本机浏览器，不会上传。': 'These settings are stored in this browser and never uploaded.'
  };

  /* 被拆成多个节点的标题没法用短语命中，改用 data-i18n 指定译文 */
  var KEY_EN = {
    'page.articles': 'Arti<span class="highlight">cles</span>'
  };

  /* 各页面英文标题 */
  var TITLE_EN = {
    '/': 'Hangou Code Lab',
    '/archive/': 'Archive · Hangou Code Lab',
    '/posts/': 'Articles · Hangou Code Lab',
    '/friends/': 'Friend Links · Hangou Code Lab',
    '/posts/about/': 'About · Hangou Code Lab',
    '/sponsor/': 'Sponsor · Hangou Code Lab',
    '/changelog/': 'Changelog · Hangou Code Lab',
    '/privacy/': 'Privacy Policy · Hangou Code Lab',
    '/settings/': 'Settings · Hangou Code Lab'
  };

  var root = document.documentElement;
  var titleZh = document.title;
  var textRecords = [];
  var attrRecords = [];
  var keyRecords = [];
  var collected = false;
  var current = getStored();

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh';
    } catch (e) {
      return 'zh';
    }
  }

  function normalizePath(pathname) {
    var p = pathname.replace(/index\.html$/, '');
    return p.charAt(p.length - 1) === '/' ? p : p + '/';
  }

  /* 双语变体（data-lang-variant）里的内容是文章原文或译文，
     由全文翻译开关（article-lang.js）接管，这里整体跳过，
     避免「界面语言切了、全文翻译没开」时中英混在一张卡片里。 */
  function inVariant(node) {
    var el = node.parentNode;
    while (el && el.nodeType === 1) {
      if (el.hasAttribute('data-lang-variant')) { return true; }
      el = el.parentNode;
    }
    return false;
  }

  /* 文本节点：首尾空白原样保留，只替换中间那段短语 */
  function collectTextNodes(scope) {
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var raw = node.nodeValue;
      if (!raw) { continue; }
      if (inVariant(node)) { continue; }
      var key = raw.trim();
      var en = ZH_TO_EN[key];
      if (!en) { continue; }
      textRecords.push({ node: node, zh: raw, en: raw.replace(key, en) });
    }
  }

  function collectScope(scope) {
    collectTextNodes(scope);
    var list = [scope].concat(Array.prototype.slice.call(scope.querySelectorAll('*')));
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      for (var j = 0; j < ATTRS.length; j++) {
        var name = ATTRS[j];
        if (!el.hasAttribute(name)) { continue; }
        var val = el.getAttribute(name);
        var key = val ? val.trim() : '';
        var en = ZH_TO_EN[key];
        if (en) {
          attrRecords.push({ el: el, name: name, zh: val, en: val.replace(key, en) });
        }
      }
      var i18nKey = el.getAttribute('data-i18n');
      if (i18nKey && KEY_EN[i18nKey]) {
        keyRecords.push({ el: el, zh: el.innerHTML, en: KEY_EN[i18nKey] });
      }
    }
  }

  function collect() {
    if (collected) { return; }
    collected = true;
    var scopes = document.querySelectorAll(SCOPE_SELECTOR);
    for (var i = 0; i < scopes.length; i++) {
      collectScope(scopes[i]);
    }
  }

  function syncButtons(lang) {
    var btns = document.querySelectorAll('[data-lang-option]');
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute('data-lang-option') === lang;
      btns[i].classList.toggle('is-active', on);
      btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function applyLang(lang) {
    var en = lang === 'en';
    var i;

    if (en) {
      root.setAttribute('data-lang', 'en');
      root.setAttribute('lang', 'en');
    } else {
      root.removeAttribute('data-lang');
      root.setAttribute('lang', 'zh-CN');
    }

    for (i = 0; i < textRecords.length; i++) {
      var t = textRecords[i];
      t.node.nodeValue = en ? t.en : t.zh;
    }
    for (i = 0; i < attrRecords.length; i++) {
      var a = attrRecords[i];
      a.el.setAttribute(a.name, en ? a.en : a.zh);
    }
    for (i = 0; i < keyRecords.length; i++) {
      var k = keyRecords[i];
      k.el.innerHTML = en ? k.en : k.zh;
    }

    document.title = en ? (TITLE_EN[normalizePath(location.pathname)] || titleZh) : titleZh;
    syncButtons(lang);

    /* 通知其他模块（如全文翻译）跟随界面语言刷新 */
    document.dispatchEvent(new CustomEvent('hcl:lang', { detail: { lang: lang } }));
  }

  function setLang(lang) {
    var next = lang === 'en' ? 'en' : 'zh';
    if (next === current) { return; }
    current = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) { /* 忽略隐私模式下的写入失败 */ }
    applyLang(next);
  }

  collect();
  applyLang(current);

  var options = document.querySelectorAll('[data-lang-option]');
  for (var i = 0; i < options.length; i++) {
    options[i].addEventListener('click', function () {
      setLang(this.getAttribute('data-lang-option'));
    });
  }

  window.HCLI18n = { get: function () { return current; }, set: setLang };
})();

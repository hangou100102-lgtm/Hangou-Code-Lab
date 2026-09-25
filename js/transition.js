/* 翻页过渡：点站内链接时按页面在站点里的前后位置决定方向 ——
   去「更靠后」的页面：当前页向左滑出、新页面从右侧滑入；
   回「更靠前」的页面：方向整体反过来。
   浏览器自带的前进/后退按钮也走后一条路（没有 forward 标记就当作后退）。
   另外，点到当前页自己时不翻页，直接回到顶端。 */
(function () {
  'use strict';

  var LEAVE_MS = 200;
  var DIR_KEY = 'hcl-nav-dir';
  var SEEN_KEY = 'hcl-nav-seen';

  /* 站点的页面顺序，决定「左右」：序号越大越靠右。
     加新页面时记得同步这里，否则那个页面会被当成一级页处理。 */
  var ORDER = [
    '/',
    '/posts/',
    '/archive/',
    '/friends/',
    '/posts/about/',
    '/changelog/',
    '/sponsor/',
    '/privacy/',
    '/settings/'
  ];

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function orderOf(pathname) {
    var path = pathname.replace(/index\.html$/, '');
    var i = ORDER.indexOf(path);
    return i < 0 ? 1 : i;
  }

  // 从 bfcache 返回时页面会带着 is-leaving 一起还原，必须清掉，否则整页停在滑出状态。
  // 注意 pageshow 在每次普通加载时也会触发，所以这里只碰 is-leaving ——
  // nav-back 是 <head> 脚本刚根据来路打上的，在这里删会把它抹掉、连进场动画也跟着重播。
  window.addEventListener('pageshow', function () {
    document.documentElement.classList.remove('is-leaving');
  });

  document.addEventListener('click', function (event) {
    // 只接管左键的普通点击
    if (event.defaultPrevented || event.button !== 0) { return; }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }

    var node = event.target;
    var link = node instanceof Element ? node.closest('a') : null;
    if (!link) { return; }

    if (link.target && link.target !== '_self') { return; }
    if (link.hasAttribute('download')) { return; }

    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') { return; }

    var url;
    try {
      url = new URL(href, location.href);
    } catch (err) {
      return;
    }

    // 站外链接不做过渡
    if (url.origin !== location.origin) { return; }

    // 目标就是当前页（路径与查询串都一样）：不翻页，直接回到顶端
    if (url.pathname === location.pathname && url.search === location.search) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }

    // 系统开了「减弱动态效果」就不做过渡，让浏览器直接跳
    if (reduced) { return; }

    var root = document.documentElement;
    var backward = orderOf(url.pathname) < orderOf(location.pathname);

    // 方向既作用于离场（这一页往哪边滑走），也通过 sessionStorage
    // 传给下一页，决定它从哪边滑进来
    if (backward) {
      root.classList.add('nav-back');
    } else {
      root.classList.remove('nav-back');
    }

    try {
      sessionStorage.setItem(DIR_KEY, backward ? 'backward' : 'forward');
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch (err) { /* 隐私模式下 sessionStorage 可能不可用，忽略即可 */ }

    event.preventDefault();
    root.classList.add('is-leaving');

    window.setTimeout(function () {
      location.href = url.href;
    }, LEAVE_MS);
  }, false);
})();

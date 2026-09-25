/* 文章评论（giscus）：用 GitHub Discussions 存评论，静态站点无需后端。
   评论语言跟随站点主题 —— 加载时按当前主题初始化，
   之后站点切主题时再把新主题发给 giscus 的 iframe。 */
(function () {
  'use strict';

  var host = document.getElementById('giscusHost');
  if (!host) { return; }

  /* 下面几项来自 https://giscus.app 的配置结果：
     repo 和 repoId 跟着仓库走，基本不用改；
     CATEGORY / CATEGORY_ID 是评论落在哪个 Discussion 分类，
     可以在 giscus.app 上换成自己新建的分类。CATEGORY_ID 没填时不加载。 */
  var REPO = 'hangou100102-lgtm/Hangou-Code-Lab';
  var REPO_ID = 'R_kgDOULrVTw';
  var CATEGORY = 'Announcements';
  var CATEGORY_ID = 'DIC_kwDOULrVT84DGYVe';

  if (!CATEGORY_ID) { return; }

  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function postTheme() {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame || !frame.contentWindow) { return; }
    frame.contentWindow.postMessage({
      giscus: { setConfig: { theme: currentTheme() } }
    }, 'https://giscus.app');
  }

  var script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';

  var config = {
    'data-repo': REPO,
    'data-repo-id': REPO_ID,
    'data-category': CATEGORY,
    'data-category-id': CATEGORY_ID,
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'bottom',
    'data-theme': currentTheme(),
    'data-lang': 'zh-CN'
  };

  Object.keys(config).forEach(function (key) {
    script.setAttribute(key, config[key]);
  });

  host.appendChild(script);

  // theme.js 通过增删 <html data-theme> 切换主题，监听这个属性即可同步
  new MutationObserver(postTheme).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();

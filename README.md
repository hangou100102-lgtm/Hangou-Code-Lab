# Hangou Code Lab

Hangou 的个人博客，记录学习、代码与生活。

> 在线访问：**<https://blog.hangou.top>**

一个纯 HTML / CSS / JS 的静态博客站点，无需构建工具、数据库或后端服务，一个静态目录即可部署上线。

## 特性

- 直角矩形风格，默认深色主题，支持切换浅色主题并记住用户偏好
- 桌面端直接显示完整导航，移动端使用带图标的侧边抽屉导航
- 侧边抽屉支持遮罩模糊、Esc 关闭、遮罩关闭、焦点管理和滚动锁定
- 主题切换使用统一的全屏遮罩过渡，避免导航栏、文章卡片和页脚按钮动画不同步
- 页面首屏显示“加载中”遮罩，资源加载完成后自动淡出移除
- 首页支持按标题、标签和摘要进行多关键词模糊搜索
- 首页文章摘要自动截断，搜索仍使用完整文章文本
- 文章页支持点击正文图片放大预览，并提供下载按钮
- 提供关于我、友链和归档页面
- 页脚直达 B 站、GitHub 和爱发电主页
- 响应式布局，适配桌面端和移动端

## 目录结构

```
Myblog/
├── index.html                 # 首页：博客简介、搜索和文章列表
├── archive/
│   └── index.html             # 文章归档页
├── friends/
│   └── index.html             # 友链页
├── posts/
│   └── about/
│       └── index.html         # 关于我文章页
├── css/
│   └── style.css              # 全局样式、主题变量和响应式规则
├── js/
│   ├── loading.js             # 首屏加载遮罩
│   ├── menu.js                # 移动端导航抽屉与焦点管理
│   ├── search.js              # 首页文章搜索
│   ├── theme.js               # 深浅主题切换与偏好持久化
│   └── lightbox.js             # 文章图片预览与下载
├── images/
│   ├── avatar.png             # 头像和 favicon
│   ├── Image_1764458904822.jpg # 首页文章配图
│   └── placeholder.svg         # 预留占位资源
├── CNAME                      # GitHub Pages 自定义域名
└── README.md
```

## 本地运行

这是一个纯静态站点，可以直接打开，也可以使用本地服务器预览。

**直接打开**

双击 `index.html` 即可浏览。主题切换、搜索和导航等功能可以直接使用；使用本地服务器更接近线上环境。

**使用本地服务器**

任选一种静态服务器：

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

然后访问 <http://localhost:8080>。

## 新增文章

1. 在 `posts/` 下新建文章目录，例如 `posts/my-new-post/`；
2. 在目录中创建 `index.html`，可参考 `posts/about/index.html` 的页面结构；
3. 根据新文章所在目录调整 CSS、图片和 JavaScript 的相对路径；
4. 在根目录 `index.html` 的 `.post-list` 中添加文章条目；
5. 在 `archive/index.html` 中添加对应的归档记录。

首页文章条目示例：

```html
<article class="post-item">
  <a class="post-thumb-link" href="posts/my-new-post/" tabindex="-1" aria-hidden="true">
    <img class="post-thumb" src="images/article-cover.jpg" alt="文章配图" loading="lazy" />
  </a>
  <div class="post-body">
    <h2><a href="posts/my-new-post/">文章标题</a></h2>
    <div class="post-meta">
      <span class="date">2026-09-05</span>
      <span class="tag">标签</span>
    </div>
    <p class="post-excerpt">文章摘要。</p>
  </div>
</article>
```

新文章按时间倒序放在首页列表上方，并同步更新归档页。

## 修改主题颜色

全部主题变量定义在 `css/style.css` 顶部：

- `:root`：深色模式，默认主题
- `:root[data-theme="light"]`：浅色模式

修改 `--accent`、`--bg`、`--surface` 等变量即可调整整体配色。主题偏好保存在浏览器的 `localStorage` 中，键名为 `hcl-theme`。

## 修改导航和赞助链接

四个页面都包含统一的桌面导航和移动端抽屉：

- `index.html`
- `posts/about/index.html`
- `friends/index.html`
- `archive/index.html`

修改导航时需要同步更新这四个页面。赞助按钮使用订单链接，顶栏和移动端抽屉中的链接也需要一起更新。

## 部署

静态站点可以部署到任意静态托管平台。使用 GitHub Pages 时：

1. 将仓库推送到 GitHub 的 `main` 分支；
2. 在仓库的 Settings → Pages 中选择分支部署；
3. 将自定义域名写入根目录的 `CNAME` 文件；
4. 在 DNS 服务商处将域名解析到对应的 GitHub Pages 地址；
5. 等待 GitHub Pages 完成部署后访问站点。

当前自定义域名为 `blog.hangou.top`。

## License

Copyright © 2026 Hangou. All rights reserved.

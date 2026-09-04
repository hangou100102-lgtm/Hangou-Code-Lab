# Hangou Code Lab

Hangou 的个人博客，记录学习、代码与生活。

一个纯 HTML / CSS / JS 手写的博客站点：无需构建工具、无需数据库，一个静态目录即可部署上线。

## 特性

- 直角矩形极简视觉风格，默认深色 + 可切换浅色主题（右上角按钮，偏好会记住）
- 深 / 浅两套配色均由 CSS 变量驱动，改 `css/style.css` 顶部的主题色板即可整体换肤
- 响应式布局，桌面与移动端都可用
- 页脚直达 B 站 / GitHub 主页

## 目录结构

```
Myblog/
├── index.html                 # 首页：博客简介 + 文章列表
├── css/
│   └── style.css              # 全局样式（含深/浅主题变量）
├── js/
│   └── theme.js               # 深浅主题切换与偏好持久化
├── images/
│   └── avatar.png             # 头像 / favicon
├── posts/
│   ├── first-post/            # 每篇文章一个目录
│   │   └── index.html
│   └── draft/                 # 草稿占位示例
│       └── index.html
├── CNAME                      # GitHub Pages 自定义域名（如启用）
└── README.md
```

## 本地运行

这是一个纯静态站点，任选一种方式：

**方式一：直接打开**

双击 `index.html` 即可浏览（除主题偏好外功能完整）。

**方式二：本地服务器（推荐）**

任意静态服务器，例如：

```bash
# Python
python -m http.server 8080

# 或 Node
npx serve .
```

然后访问 http://localhost:8080 。

## 如何新增一篇文章

1. 在 `posts/` 下新建一个目录（如 `posts/my-new-post/index.html`），可复制 `posts/first-post/index.html` 作为模板；
2. 修改文章页里的标题、日期、标签与正文；
3. 在 `index.html` 的文章列表最上方加一条条目，指向新文章路径：

```html
<article class="post-item">
  <h2><a href="posts/my-new-post/">文章标题</a></h2>
  <div class="post-meta">
    <span class="date">2026-09-02</span>
    <span class="tag">标签</span>
  </div>
  <p class="post-excerpt">文章摘要。</p>
</article>
```

> 提示：列表按时间倒序展示，新文章放最上面。

## 修改主题颜色

主题色与全部配色定义在 `css/style.css` 顶部的两段变量中：

- `:root`：深色模式（默认）
- `:root[data-theme="light"]`：浅色模式

调整 `--accent`（强调色）即可整体换色，无需改动页面结构。

## 部署

静态站点可部署到任意静态托管。若使用 GitHub Pages：

1. 将仓库推送到 GitHub（`main` 分支）；
2. 在仓库 Settings → Pages 中选择分支部署；
3. 若使用自定义域名，将域名写入根目录 `CNAME` 文件并在 DNS 处解析。

## License

Copyright © 2026 Hangou. All rights reserved.

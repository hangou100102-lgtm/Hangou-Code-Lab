# blog-api 后端

博客后端（PHP + MySQL），与 GitHub Pages 上的前端分离部署。所有接口返回统一 JSON：

- 成功：`{"ok": true, ...}`
- 失败：`{"ok": false, "error": "中文原因"}` + 对应 HTTP 状态码

## 目录结构

```
api/
├─ common/bootstrap.php   公共层：配置读取、PDO、CORS、JSON 输出、统一错误
├─ auth/                  管理员认证（登录 / 登出 / 状态）+ 守卫 + CSRF + 限流
├─ admin/                 后台登录页（同源静态页，浏览器直接访问 /api/admin/）
├─ views.php              浏览量接口（既有功能，已改用公共层，对外行为不变）
├─ install.php            安装向导（装完生成 install.lock，建议手动删除）
├─ schema.sql             建表 SQL
├─ config.example.php     配置模板（config.php 由安装生成，已 gitignore）
└─ data/                  运行时自动创建：登录限流记录（0700，勿对外暴露）
```

## 数据库表

| 表 | 字段 | 说明 |
|---|---|---|
| `admins` | id, username(唯一), password_hash, created_at | 管理员，密码 password_hash 加密 |
| `post_views` | path(主键), views, updated_at | 文章浏览数 |

## 接口一览

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/views.php?paths=/a,/b` | GET | 批量读浏览数 |
| `/api/views.php` `{path}` | POST | 浏览 +1 并返回最新值 |
| `/api/auth/login.php` `{username,password}` | POST | 登录，成功下发会话 Cookie + CSRF token |
| `/api/auth/me.php` | GET | 当前登录状态（未登录也返回 200，`authed:false`） |
| `/api/auth/logout.php` | POST | 退出（需 `X-CSRF-Token` 头） |

## 安全约定

- SQL 一律 PDO 预处理；表名等标识符走白名单正则
- 页面输出由前端框架转义；后台页不回显密码
- 登录限流：同 IP 15 分钟 8 次（文件记录，`api/data/`）
- 会话 Cookie：HttpOnly + SameSite=Lax，https 下自动加 Secure
- 登录后所有写操作必须带 `X-CSRF-Token`（值来自登录/me 响应）

## 部署

1. 服务器上先备份旧版：`tar -czf ~/api_backup_$(date +%Y%m%d_%H%M%S).tar.gz api/`
2. 上传本目录覆盖（保留服务器上的 `config.php` 与 `install.lock`，不要删）
3. `api/` 目录需可写（限流记录写 `data/`）
4. 浏览器访问 `https://域名/api/admin/` 验证登录

## 以后整合第二套源码要注意

1. 一切数据库/配置/输出必须走 `common/bootstrap.php`，禁止再写内联连接
2. 新功能一个文件夹（如 `posts/`、`comments/`），PHP 用 `Blog\Posts` 之类命名空间隔离
3. 新表沿用安装时的前缀（前缀已拼在 config 的完整表名里），只增表、不动旧表旧字段
4. 接口 JSON 结构保持 `ok` 字段约定；不改 `views.php` 的路径与返回格式
5. 后台新页面继续放 `admin/`，登录守卫用 `auth_require_login()` + CSRF

-- 后端数据表结构
--
-- 两种建表方式，任选其一：
--   1. 推荐：直接访问 api/install.php，安装向导会自动建库建表并写入配置文件；
--   2. 手动：在 phpMyAdmin 中选中目标数据库 →「导入」→ 选择本文件执行。
--
-- 表名默认不带前缀；如果安装了表前缀（例如 hcl_），请自行给下面的表名加上前缀，
-- 并保证 api/config.php 里的 table / admin_table 与之对应。

-- 管理员账号
CREATE TABLE IF NOT EXISTS `admins` (
  `id`            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(64)     NOT NULL COMMENT '登录名',
  `password_hash` VARCHAR(255)    NOT NULL COMMENT 'password_hash() 加密后的密码',
  `created_at`    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员账号';

-- 文章浏览数
CREATE TABLE IF NOT EXISTS `post_views` (
  `path`       VARCHAR(191)     NOT NULL COMMENT '站内路由，例如 /posts/about',
  `views`      BIGINT UNSIGNED  NOT NULL DEFAULT 0 COMMENT '累计浏览次数',
  `updated_at` TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章浏览数';

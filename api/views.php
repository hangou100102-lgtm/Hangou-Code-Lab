<?php
/**
 * 文章浏览数接口
 *
 * GET  /api/views.php?paths=/posts/about,/posts/other
 *      批量读取浏览数 → {"ok":true,"views":{"/posts/about":128,"/posts/other":0}}
 *
 * POST /api/views.php   body: {"path":"/posts/about"}
 *      记一次浏览并返回最新值 → {"ok":true,"path":"/posts/about","views":129}
 *
 * 前置条件：
 *   1. 复制 config.example.php 为 config.php 并填好数据库信息；
 *   2. 在 phpMyAdmin 中导入 schema.sql 建表。
 *
 * 前端调用封装见 src/lib/views.ts，接口地址通过 VITE_VIEWS_API 配置。
 */

declare(strict_types=1);

/* 公共层：配置 / PDO / CORS / 统一 JSON 输出（fail 等）都在这里 */
require_once __DIR__ . '/common/bootstrap.php';

/* CORS 与响应头行为和重构前完全一致（views 接口不使用 Cookie） */
blog_cors(false);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* ---------- 数据库连接与表名 ---------- */
$pdo   = blog_db();
$table = blog_table('table', 'post_views');

/* ---------- 只接受站内路由，避免任意字符串被写进表 ---------- */
function normalize_paths(string $raw): array
{
    $paths = [];
    foreach (explode(',', $raw) as $item) {
        $p = trim($item);
        if ($p === '' || $p[0] !== '/' || strlen($p) > 191) {
            continue;
        }
        $paths[$p] = true;
        if (count($paths) >= 100) {
            break;
        }
    }
    return array_keys($paths);
}

/* ---------- 路由 ---------- */
if ($method === 'GET') {
    $paths = normalize_paths((string) ($_GET['paths'] ?? ''));
    if ($paths === []) {
        echo json_encode(['ok' => true, 'views' => new stdClass()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $holders = implode(',', array_fill(0, count($paths), '?'));
    $stmt = $pdo->prepare("SELECT path, views FROM `{$table}` WHERE path IN ({$holders})");
    $stmt->execute($paths);

    /* 表里没有记录的文章要补 0，前端才能统一渲染 */
    $views = array_fill_keys($paths, 0);
    foreach ($stmt->fetchAll() as $row) {
        $views[$row['path']] = (int) $row['views'];
    }

    echo json_encode(['ok' => true, 'views' => $views], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $raw  = file_get_contents('php://input');
    $body = json_decode((string) $raw, true);
    $path = is_array($body) ? (string) ($body['path'] ?? '') : (string) ($_POST['path'] ?? '');

    if ($path === '' || $path[0] !== '/' || strlen($path) > 191) {
        fail(400, 'path 不合法，应以 / 开头的站内路由');
    }

    /* 用 LAST_INSERT_ID(views + 1) 把自增后的值带回本次连接，
     * 避免「更新后再查一次」在并发下读到别的请求的值。 */
    $stmt = $pdo->prepare(
        "INSERT INTO `{$table}` (path, views) VALUES (?, 1)
         ON DUPLICATE KEY UPDATE views = LAST_INSERT_ID(views + 1)"
    );
    $stmt->execute([$path]);

    /* 新插入时 rowCount 为 1（没有自增列，lastInsertId 不可用）；命中已有记录时为 2 */
    $views = $stmt->rowCount() === 1 ? 1 : (int) $pdo->lastInsertId();

    echo json_encode(['ok' => true, 'path' => $path, 'views' => $views], JSON_UNESCAPED_UNICODE);
    exit;
}

fail(405, '只支持 GET 与 POST');

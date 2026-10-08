<?php
/**
 * 退出登录
 *
 * POST /api/auth/logout.php（需带 X-CSRF-Token 头）
 * → {"ok":true}
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

blog_cors(false);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fail(405, '只支持 POST');
}

auth_csrf_check();
auth_session_boot();

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();

blog_json([]);

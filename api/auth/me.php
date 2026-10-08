<?php
/**
 * 当前登录状态
 *
 * GET /api/auth/me.php
 * 已登录 → {"ok":true,"authed":true,"username":"...","csrf":"..."}
 * 未登录 → {"ok":true,"authed":false}（HTTP 仍为 200，前端据此切换界面）
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

blog_cors(false);

$user = auth_current_user();
if ($user === null) {
    blog_json(['authed' => false]);
}

blog_json([
    'authed'   => true,
    'username' => (string) $user['username'],
    'csrf'     => auth_csrf_token(),
]);

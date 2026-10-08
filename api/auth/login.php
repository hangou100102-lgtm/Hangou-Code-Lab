<?php
/**
 * 管理员登录接口
 *
 * POST /api/auth/login.php   body: {"username":"...","password":"..."}
 * 成功 → {"ok":true,"username":"...","csrf":"..."}，会话 Cookie 已下发
 * 失败 → 401 {"ok":false,"error":"用户名或密码不正确"}（不区分哪个错，防枚举）
 *
 * 安全：文件限流（同 IP 15 分钟 8 次）、password_verify、登录成功重生成会话 ID。
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

blog_cors(false); // 同源后台页，无需 credentials；跨域登录暂不开放

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fail(405, '只支持 POST');
}

$key = auth_client_key();
if (!auth_rate_limit($key, 8, 900)) {
    fail(429, '尝试次数过多，请 15 分钟后再试');
}

$body     = blog_body();
$username = trim((string) ($body['username'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($username === '' || $password === '') {
    fail(400, '请填写用户名和密码');
}

/* 查询管理员（install.php 建的 admins 表），字段全部参数化 */
$adminTable = blog_table('admin_table', 'admins');
$stmt = blog_db()->prepare(
    "SELECT id, username, password_hash FROM `{$adminTable}` WHERE username = ? LIMIT 1"
);
$stmt->execute([$username]);
$row = $stmt->fetch();

if ($row === false || !password_verify($password, (string) $row['password_hash'])) {
    error_log('[auth] 登录失败: user=' . $username . ' ip=***');
    fail(401, '用户名或密码不正确');
}

/* 防会话固定：登录成功必须换 ID */
auth_session_boot();
session_regenerate_id(true);
$_SESSION['admin'] = [
    'id'       => (int) $row['id'],
    'username' => (string) $row['username'],
];

auth_rate_clear($key);

blog_json([
    'username' => (string) $row['username'],
    'csrf'     => auth_csrf_token(),
]);

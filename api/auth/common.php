<?php
/**
 * 认证公共层：Session、登录态守卫、CSRF、登录频率限制
 *
 * 被所有 api/auth/*.php 引用。管理员记录在 install.php 创建，
 * 密码以 password_hash() 存储，登录校验用 password_verify()。
 */

declare(strict_types=1);

require_once dirname(__DIR__) . '/common/bootstrap.php';

/* ---------- Session ---------- */

/** 以安全参数启动会话（HttpOnly；https 下加 Secure；同源后台用 Lax 即可） */
function auth_session_boot(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/api/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => $https,
    ]);
    session_start();
}

/** 当前登录的管理员，未登录返回 null */
function auth_current_user(): ?array
{
    auth_session_boot();
    if (isset($_SESSION['admin']) && is_array($_SESSION['admin'])) {
        return $_SESSION['admin'];
    }
    return null;
}

/** 守卫：未登录直接 401（后续后台管理接口统一调用） */
function auth_require_login(): array
{
    $user = auth_current_user();
    if ($user === null) {
        fail(401, '未登录或登录已过期');
    }
    return $user;
}

/* ---------- CSRF ---------- */

/** 取（首次则生成）当前会话的 CSRF Token */
function auth_csrf_token(): string
{
    auth_session_boot();
    if (!isset($_SESSION['csrf']) || !is_string($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

/** 校验请求头 X-CSRF-Token */
function auth_csrf_check(): void
{
    $token  = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $expect = auth_csrf_token();
    if ($token === '' || !hash_equals($expect, $token)) {
        fail(403, 'CSRF 校验失败，请刷新页面重试');
    }
}

/* ---------- 登录频率限制（文件存储，无需建表） ---------- */

/** 取客户端 IP 的匿名散列（不落明文，日志脱敏） */
function auth_client_key(): string
{
    return hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
}

/**
 * 滑动窗口限流。允许返回 true 并记录本次；超限返回 false。
 * 用于登录接口防爆破：同一 IP 15 分钟内最多 8 次尝试。
 */
function auth_rate_limit(string $key, int $max, int $windowSec): bool
{
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        /* 目录建不出来时放行，避免把所有人锁死 */
        return true;
    }

    $file  = $dir . '/rate_' . $key . '.json';
    $now   = time();
    $tries = [];

    if (is_file($file)) {
        $tries = json_decode((string) file_get_contents($file), true);
        $tries = is_array($tries) ? array_map('intval', $tries) : [];
    }
    $tries = array_values(array_filter($tries, static fn($t): bool => $t > $now - $windowSec));

    if (count($tries) >= $max) {
        return false;
    }

    $tries[] = $now;
    file_put_contents($file, json_encode($tries), LOCK_EX);
    return true;
}

/** 登录成功后清掉该 IP 的尝试记录 */
function auth_rate_clear(string $key): void
{
    $file = dirname(__DIR__) . '/data/rate_' . $key . '.json';
    if (is_file($file)) {
        @unlink($file);
    }
}

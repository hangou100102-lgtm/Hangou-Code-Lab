<?php
/**
 * 公共引导层（所有后端接口统一从这里起步）
 *
 * 提供：配置读取、PDO 连接、CORS、JSON 输出、统一错误格式。
 * 以后整合第二套源码时，也必须复用本文件，不允许另起一套连接方式。
 *
 * 约定（与既有接口保持一致）：
 *   - 成功：{"ok":true, ...}
 *   - 失败：{"ok":false,"error":"中文原因"}，配合对应 HTTP 状态码
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

/* ---------- 配置 ---------- */

/** 读取 api/config.php（安装向导生成或手动从 config.example.php 复制），进程内缓存 */
function blog_config(): array
{
    static $config = null;
    if ($config === null) {
        $file = dirname(__DIR__) . '/config.php';
        if (!is_file($file)) {
            fail(500, '缺少 config.php，请复制 config.example.php 并按说明填写数据库信息');
        }
        $config = require $file;
        if (!is_array($config)) {
            fail(500, 'config.php 格式不正确，应 return 一个数组');
        }
    }
    return $config;
}

/* ---------- 数据库 ---------- */

/** 共享 PDO 连接（进程内单例）：utf8mb4、异常模式、禁用预处理模拟 */
function blog_db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $config = blog_config();
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
                (string) $config['host'],
                (int) $config['port'],
                (string) $config['database']
            );
            $pdo = new PDO($dsn, (string) $config['username'], (string) $config['password'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            /* 不把数据库细节回给前端，只记到服务器日志 */
            error_log('[blog] 数据库连接失败: ' . $e->getMessage());
            fail(500, '数据库连接失败');
        }
    }
    return $pdo;
}

/** 读取配置里的表名并校验合法性（表前缀在安装时已拼进完整表名） */
function blog_table(string $key, string $default): string
{
    $table = (string) (blog_config()[$key] ?? $default);
    if (!preg_match('/^[A-Za-z0-9_]+$/', $table)) {
        fail(500, '表名配置不合法');
    }
    return $table;
}

/* ---------- CORS ---------- */

/**
 * 输出跨域响应头。站点前端在 GitHub Pages、后端在自有服务器，属跨域。
 *
 * @param bool $credentials 是否允许携带 Cookie（登录态接口必须为 true；
 *                          此时浏览器禁止 Origin 为 *，只能精确匹配白名单）
 */
function blog_cors(bool $credentials = false): void
{
    $allowed = blog_config()['allow_origins'] ?? ['*'];
    $origin  = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($credentials) {
        if ($origin !== '' && $origin !== '*' && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
        }
    } else {
        /* 与 views.php 原有行为完全一致：白名单为 * 时输出 * */
        if (in_array('*', $allowed, true)) {
            header('Access-Control-Allow-Origin: *');
        } elseif ($origin !== '' && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
        }
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

    /* 预检请求直接短路 */
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/* ---------- 统一输出 ---------- */

/** 成功输出并结束 */
function blog_json(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data + ['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

/** 失败输出并结束（错误格式与既有接口一致） */
function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

/** 读取请求体里的 JSON（兼容 form 提交） */
function blog_body(): array
{
    $raw  = file_get_contents('php://input');
    $body = json_decode((string) $raw, true);
    return is_array($body) ? $body : $_POST;
}

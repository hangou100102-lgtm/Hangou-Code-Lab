/* 浏览数接口层
 *
 * 站点是纯静态的（GitHub Pages），浏览数只能存在远端接口里。
 * 接口地址通过环境变量 VITE_VIEWS_API 配置（见 .env.example），后端实现见 api/views.php。
 *
 * 接口契约：
 *   GET  {base}?paths=/posts/about,/posts/other
 *        → { ok: true, views: { "/posts/about": 128, "/posts/other": 0 } }
 *   POST {base}  body { path: "/posts/about" }
 *        → { ok: true, path: "/posts/about", views: 129 }
 *
 * 地址未配置时的兜底：
 *   - 本地开发（npm run dev）用 localStorage 模拟，方便预览 UI；
 *   - 生产构建则视为「未接入」，不显示浏览数，避免把模拟数据当成真实数据。
 */

const API_BASE = (import.meta.env.VITE_VIEWS_API ?? '').trim().replace(/\/+$/, '');

/** 是否显示浏览数：配了接口地址，或处于本地开发（走模拟数据） */
export function viewsEnabled(): boolean {
  return API_BASE !== '' || import.meta.env.DEV;
}

/** 批量读取浏览数，表中没有记录的路由返回 0 */
export async function fetchViews(paths: string[]): Promise<Record<string, number>> {
  if (paths.length === 0) {
    return {};
  }
  if (API_BASE === '') {
    return import.meta.env.DEV ? mockFetch(paths) : {};
  }

  const url = `${API_BASE}?paths=${encodeURIComponent(paths.join(','))}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`读取浏览数失败：HTTP ${res.status}`);
  }
  const data = (await res.json()) as { ok?: boolean; views?: Record<string, number> };
  if (!data.ok || !data.views) {
    throw new Error('读取浏览数失败：返回格式不正确');
  }

  /* 后端只回有记录的路由，这里补齐所需的键，调用方无需再判空 */
  const counts: Record<string, number> = {};
  paths.forEach((p) => {
    counts[p] = Number(data.views?.[p]) || 0;
  });
  return counts;
}

/** 记一次浏览并返回最新浏览数 */
export async function reportView(path: string): Promise<number> {
  if (API_BASE === '') {
    if (!import.meta.env.DEV) {
      return 0;
    }
    return mockReport(path);
  }

  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  if (!res.ok) {
    throw new Error(`上报浏览数失败：HTTP ${res.status}`);
  }
  const data = (await res.json()) as { ok?: boolean; views?: number };
  if (!data.ok || typeof data.views !== 'number') {
    throw new Error('上报浏览数失败：返回格式不正确');
  }
  return data.views;
}

/* ============ 本地开发的模拟数据 ============
 * 未配置接口地址时，用 localStorage 记住一份计数，让本地预览能看到接近真实的数量级。 */

const MOCK_KEY = 'hcl-mock-views';

function readMock(): Record<string, number> {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function writeMock(map: Record<string, number>): void {
  try {
    localStorage.setItem(MOCK_KEY, JSON.stringify(map));
  } catch {
    /* 隐私模式下忽略写入失败 */
  }
}

/* 用路径哈希生成一个稳定的初始值，避免所有文章都从 0 开始、看不出效果 */
function mockSeed(path: string): number {
  let hash = 0;
  for (let i = 0; i < path.length; i += 1) {
    hash = (hash * 31 + path.charCodeAt(i)) % 100000;
  }
  return 20 + (hash % 380);
}

function mockFetch(paths: string[]): Record<string, number> {
  const map = readMock();
  const counts: Record<string, number> = {};
  paths.forEach((p) => {
    counts[p] = map[p] ?? mockSeed(p);
  });
  return counts;
}

function mockReport(path: string): number {
  const map = readMock();
  const next = (map[path] ?? mockSeed(path)) + 1;
  map[path] = next;
  writeMock(map);
  return next;
}

import { useEffect, useState } from 'react';
import { fetchViews, reportView, viewsEnabled } from '../lib/views';

/* 批量读取浏览数：列表页一次请求拿全部文章，避免每张卡片各发一次请求。
   返回 null 表示尚未取到（或站点未接入接口），调用方据此决定是否渲染。 */
export function useViews(paths: string[]): Record<string, number> | null {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  /* 数组每次渲染都是新引用，用拼接后的字符串当依赖，值不变就不重复请求 */
  const key = paths.join(',');

  useEffect(() => {
    if (!viewsEnabled() || key === '') {
      return;
    }
    let alive = true;
    fetchViews(key.split(','))
      .then((map) => {
        if (alive) {
          setCounts(map);
        }
      })
      .catch(() => {
        /* 接口不可用时静默降级：不显示浏览数，不影响正文 */
      });
    return () => {
      alive = false;
    };
  }, [key]);

  return counts;
}

/* 单篇文章的浏览数：进入文章时记一次浏览，并返回展示用的最新值。
   同一浏览器会话内重复刷新不反复计数，避免自己刷自己。 */
export function useViewCount(path: string): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!viewsEnabled() || path === '') {
      return;
    }
    let alive = true;
    let task: Promise<number>;
    if (reportedInSession(path)) {
      task = fetchViews([path]).then((map) => map[path] ?? 0);
    } else {
      /* 必须在上报前同步标记：StrictMode 下 effect 会执行两次，
         若等请求返回才标记，两次调用都会真的记一次浏览 */
      markReported(path);
      task = reportView(path);
    }

    task
      .then((views) => {
        if (alive) {
          setCount(views);
        }
      })
      .catch(() => {
        /* 接口不可用时静默降级 */
      });
    return () => {
      alive = false;
    };
  }, [path]);

  return count;
}

/* 会话内已计数标记：本次会话打开过的文章不再重复上报 */
const REPORTED_KEY = 'hcl-views-reported';

function reportedInSession(path: string): boolean {
  try {
    const raw = sessionStorage.getItem(REPORTED_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(list) && list.includes(path);
  } catch {
    return false;
  }
}

function markReported(path: string): void {
  try {
    const raw = sessionStorage.getItem(REPORTED_KEY);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    const next = Array.isArray(list) ? list : [];
    if (!next.includes(path)) {
      next.push(path);
    }
    sessionStorage.setItem(REPORTED_KEY, JSON.stringify(next));
  } catch {
    /* 隐私模式下忽略写入失败 */
  }
}

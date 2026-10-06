import { useMemo, useState, type ChangeEvent, type CompositionEvent } from 'react';

/* 把查询拆成关键词：去掉标点与空白，按任意分隔切分 */
function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[\s,，。.、;；:：!！?？'"“”‘’()（）[\]{}<>《》\-_/\\|·]+/)
    .filter(Boolean);
}

/* 连续子串匹配 */
function hasSubstring(text: string, tok: string): boolean {
  return text.indexOf(tok) !== -1;
}

/* 容错模糊匹配：tok 的每个字符按顺序在 text 中出现即可（允许中间有其他字） */
function fuzzyMatch(text: string, tok: string): boolean {
  let i = 0;
  const n = tok.length;
  for (let j = 0; j < text.length && i < n; j++) {
    if (text.charAt(j) === tok.charAt(i)) {
      i++;
    }
  }
  return i === n;
}

/* 短关键词（1 个字符）用子串即可，避免模糊匹配把所有条目都搜出来 */
function matchToken(text: string, tok: string): boolean {
  if (tok.length <= 1) {
    return hasSubstring(text, tok);
  }
  return hasSubstring(text, tok) || fuzzyMatch(text, tok);
}

export function matchesQuery(text: string, query: string): boolean {
  const toks = tokenize(query);
  if (toks.length === 0) {
    return true;
  }
  const lower = text.toLowerCase();
  return toks.every((tok) => matchToken(lower, tok));
}

export interface SearchField<T> {
  value: string;
  setValue: (v: string) => void;
  results: T[];
  /** 当前查询是否命中任何结果 */
  hasResults: boolean;
  /** 输入法组合输入期间不实时过滤，避免误清空 */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: (e: CompositionEvent<HTMLInputElement>) => void;
}

/* 即时模糊搜索：支持多关键词，需全部命中 */
export function useSearch<T>(items: T[], getText: (item: T) => string): SearchField<T> {
  const [value, setValue] = useState('');
  /* 组合输入状态用 state：让 results 得以按「是否组合中」重新计算。
     输入本身始终写入 value，不因组合状态而阻断——这样即便 compositionend 没按预期触发、
     标志卡在组合中，输入框也能照常显示键入的字符，不会出现「输不进去」。 */
  const [composing, setComposing] = useState(false);

  const results = useMemo(() => {
    // 组合输入期间不过滤：此时 value 是拼音等中间态，避免被当成关键词
    if (composing) {
      return items;
    }
    if (!value.trim()) {
      return items;
    }
    return items.filter((item) => matchesQuery(getText(item), value));
  }, [items, value, composing, getText]);

  return {
    value,
    setValue,
    results,
    hasResults: results.length > 0,
    onChange: (e) => {
      // 始终跟随键入更新，保证英文与中文（含拼音组合阶段）都能上屏
      setValue(e.target.value);
    },
    onCompositionStart: () => setComposing(true),
    onCompositionEnd: (e) => {
      setComposing(false);
      setValue(e.currentTarget.value);
    }
  };
}

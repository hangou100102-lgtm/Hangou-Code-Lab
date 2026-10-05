import { useMemo, useRef, useState, type ChangeEvent } from 'react';

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
  onCompositionEnd: () => void;
}

/* 即时模糊搜索：支持多关键词，需全部命中 */
export function useSearch<T>(items: T[], getText: (item: T) => string): SearchField<T> {
  const [value, setValue] = useState('');
  const [composing, setComposing] = useState(false);
  /* 输入法组合期间的原始输入，组合结束后再一次性写入，避免拼音字母被当成关键词 */
  const pending = useRef('');

  const results = useMemo(() => {
    if (!value.trim()) {
      return items;
    }
    return items.filter((item) => matchesQuery(getText(item), value));
  }, [items, value, getText]);

  return {
    value,
    setValue,
    results,
    hasResults: results.length > 0,
    onChange: (e) => {
      pending.current = e.target.value;
      if (!composing) {
        setValue(e.target.value);
      }
    },
    onCompositionStart: () => setComposing(true),
    onCompositionEnd: () => {
      setComposing(false);
      setValue(pending.current);
    }
  };
}

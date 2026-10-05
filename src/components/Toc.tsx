import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePrefs, useT } from '../context/Prefs';

interface TocItem {
  id: string;
  text: string;
}

/* 文章页目录：自动扫描 .post-main 下各板块的标题栏，
   生成锚点列表。点击平滑滚动到对应板块，滚动时高亮当前板块。
   宽屏固定显示在右侧；窄屏折叠为右下角悬浮按钮，点击展开。
   语言切换后重新扫描（标题文本随之更新）。 */
export function Toc() {
  const t = useT();
  const { lang, articleTranslate } = usePrefs();
  const { pathname } = useLocation();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [open, setOpen] = useState(false);

  /* 扫描板块并生成锚点；返回清理函数恢复原状 */
  useEffect(() => {
    setOpen(false); // 路由切换时收起窄屏抽屉
    const main = document.querySelector<HTMLElement>('.post-main');
    if (!main) {
      setItems([]);
      return;
    }

    /* 收集可跳转的标题：板块标题（.panel-head h2）与分组标题（.archive-group h2）。
       两者结构不同，锚点分别落在最近的 .panel 或 .archive-group 上。
       中英双语变体都在 DOM 中（靠 CSS display 显隐），需排除当前隐藏的那半。 */
    const candidates = Array.from(
      main.querySelectorAll<HTMLElement>('.panel-head h2, .archive-group h2')
    );
    let heads: HTMLElement[] = [];
    const list: TocItem[] = [];
    const sections: HTMLElement[] = [];
    const ids: string[] = [];
    let scanRaf = 0;

    /* 延后一帧再按可见性过滤：data-article-lang 由 Prefs 的 effect 写入，
       需等 CSS 应用后 offsetParent 才能正确反映双语变体的显隐 */
    scanRaf = window.requestAnimationFrame(() => {
      scanRaf = 0;
      heads = candidates.filter((head) => head.offsetParent !== null);

      heads.forEach((head, i) => {
        const section = head.closest<HTMLElement>('.archive-group, .panel');
        if (!section) {
          return;
        }
        const id = 'toc-' + i;
        section.id = id;
        ids.push(id);
        sections.push(section);
        list.push({ id, text: (head.textContent ?? '').trim() });
      });

      setItems(list);
      setActiveId(list[0]?.id ?? '');
    });

    /* 滚动高亮：取当前视口内最靠上的板块。
       用 scroll 计算而非 IntersectionObserver —— 板块高度差异大时后者易跳变 */
    let raf = 0;
    const onScroll = () => {
      if (raf) {
        return;
      }
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const line = 140; // 距顶栏稍下方作为判定线
        let current = list[0]?.id ?? '';
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= line) {
            current = section.id;
          } else {
            break;
          }
        }
        setActiveId(current);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
      if (scanRaf) {
        window.cancelAnimationFrame(scanRaf);
      }
      /* 清掉本次生成的 id，避免路由切换后残留 */
      ids.forEach((id, i) => {
        if (sections[i]?.id === id) {
          sections[i].removeAttribute('id');
        }
      });
    };
  }, [lang, articleTranslate, pathname]);

  /* 少于两个板块不显示目录 */
  if (items.length < 2) {
    return null;
  }

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <nav
        className={open ? 'toc open' : 'toc'}
        id="toc-panel"
        aria-label={t('目录')}
      >
        <div className="toc-title">{t('目录')}</div>
        <ul className="toc-list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={'#' + item.id}
                className={item.id === activeId ? 'active' : undefined}
                aria-current={item.id === activeId ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jump(item.id);
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 窄屏悬浮按钮；宽屏通过 CSS 隐藏 */}
      <button
        type="button"
        className="toc-toggle"
        aria-label={t('目录')}
        aria-expanded={open}
        aria-controls="toc-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 窄屏展开时的遮罩，点击关闭 */}
      <div
        className={open ? 'toc-backdrop show' : 'toc-backdrop'}
        onClick={() => setOpen(false)}
      />
    </>
  );
}

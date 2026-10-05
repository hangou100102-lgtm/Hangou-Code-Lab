import { useEffect, useRef } from 'react';
import { useT } from '../context/Prefs';
import { useSiteNav } from '../context/SiteNav';
import {
  IconAifadian,
  IconArchive,
  IconBook,
  IconClock,
  IconClose,
  IconHome,
  IconLink,
  IconSliders,
  IconUser
} from './icons';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

/* 移动端导航抽屉：开合、键盘焦点管理与滚动锁定 */
export function NavDrawer({ open, onClose }: DrawerProps) {
  const t = useT();
  const { go } = useSiteNav();
  const drawerRef = useRef<HTMLElement>(null);
  const toggleFocusRef = useRef<Element | null>(null);
  const savedPadding = useRef('');

  /* 抽屉开合：切换 class / aria-hidden / inert，并锁定滚动 */
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) {
      return;
    }
    const root = document.documentElement;
    if (open) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.removeAttribute('inert');
      savedPadding.current = document.body.style.paddingRight;
      const sbw = window.innerWidth - root.clientWidth;
      if (sbw > 0) {
        document.body.style.paddingRight = sbw + 'px';
      }
      document.body.classList.add('nav-open');
      const first = drawer.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    } else {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      document.body.style.paddingRight = savedPadding.current;
      document.body.classList.remove('nav-open');
    }
  }, [open]);

  /* Esc 关闭 + Tab 焦点循环 */
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      const drawer = drawerRef.current;
      if (!drawer) {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') {
        return;
      }
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /* 记录打开前的焦点元素，关闭后归还 */
  useEffect(() => {
    if (open) {
      toggleFocusRef.current = document.activeElement;
    } else if (toggleFocusRef.current instanceof HTMLElement) {
      toggleFocusRef.current.focus();
      toggleFocusRef.current = null;
    }
  }, [open]);

  const nav = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    go(to);
  };

  return (
    <>
      <div
        className={`nav-drawer-backdrop${open ? ' show' : ''}`}
        id="navDrawerBackdrop"
        onClick={onClose}
      />
      <aside
        className="nav-drawer"
        id="navDrawer"
        aria-label={t('移动端菜单')}
        aria-hidden={!open}
        ref={drawerRef}
      >
        <div className="side-card">
          <h2 className="side-title">{t('博客')}</h2>
          <nav className="side-nav">
            <a href="#/" onClick={nav('/')}>
              <IconHome />
              {t('首页')}
            </a>
            <a href="#/posts" onClick={nav('/posts')}>
              <IconBook />
              {t('文章')}
            </a>
            <a href="#/posts/about" onClick={nav('/posts/about')}>
              <IconUser />
              {t('关于我')}
            </a>
            <a href="#/archive" onClick={nav('/archive')}>
              <IconArchive />
              {t('归档')}
            </a>
            <a href="#/changelog" onClick={nav('/changelog')}>
              <IconClock />
              {t('更新日志')}
            </a>
            <a href="#/settings" onClick={nav('/settings')}>
              <IconSliders />
              {t('设置')}
            </a>
          </nav>
        </div>
        <div className="side-card">
          <h2 className="side-title">{t('友链')}</h2>
          <nav className="side-nav">
            <a href="#/friends" onClick={nav('/friends')}>
              <IconLink />
              {t('友链列表')}
            </a>
          </nav>
        </div>
        <div className="side-card">
          <h2 className="side-title">{t('赞助')}</h2>
          <a
            className="side-sponsor"
            href="https://ifdian.net/a/hangou100102"
            target="_blank"
            rel="noopener"
            aria-label={t('爱发电赞助')}
            title={t('爱发电赞助')}
          >
            <IconAifadian />
            <span>{t('爱发电')}</span>
          </a>
        </div>
        <button type="button" className="drawer-close" aria-label={t('打开菜单')} onClick={onClose}>
          <IconClose />
        </button>
      </aside>
    </>
  );
}

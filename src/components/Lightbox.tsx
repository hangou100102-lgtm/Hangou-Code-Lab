import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '../context/Prefs';

interface Shot {
  src: string;
  alt: string;
  name: string;
}

/* 文章内图片浮窗预览 + 下载：点击 .article-body 里的图片打开全屏浮窗 */
export function Lightbox() {
  const [shot, setShot] = useState<Shot | null>(null);
  const closeTimer = useRef<number | null>(null);
  const scrollLocked = useRef(false);
  const t = useT();

  const lockScroll = useCallback(() => {
    if (scrollLocked.current) {
      return;
    }
    scrollLocked.current = true;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    if (sbw > 0) {
      document.body.style.paddingRight = sbw + 'px';
    }
    document.body.classList.add('lb-lock');
  }, []);

  const unlockScroll = useCallback(() => {
    if (!scrollLocked.current) {
      return;
    }
    scrollLocked.current = false;
    document.body.style.paddingRight = '';
    document.body.classList.remove('lb-lock');
  }, []);

  const close = useCallback(() => {
    setShot(null);
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
    }
    closeTimer.current = window.setTimeout(unlockScroll, 300);
  }, [unlockScroll]);

  /* 事件委托：点击正文图片即打开浮窗 */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const img = target instanceof Element ? target.closest('.article-body img') : null;
      if (!(img instanceof HTMLImageElement)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const src = img.currentSrc || img.src;
      const name = src.split('/').pop()?.split('?')[0] || 'image';
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
      setShot({ src, alt: img.alt || '', name });
      lockScroll();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lockScroll]);

  /* Esc 关闭 */
  useEffect(() => {
    if (!shot) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        close();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shot, close]);

  return (
    <div
      className={`lb${shot ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('图片预览')}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <button type="button" className="lb-close" aria-label={t('关闭预览')} onClick={close}>
        ×
      </button>
      <figure className="lb-figure">
        <img className="lb-img" alt={shot?.alt ?? ''} src={shot?.src ?? ''} />
        <figcaption className="lb-bar">
          <a className="lb-download" href={shot?.src ?? '#'} download={shot?.name}>
            {t('下载图片')}
          </a>
        </figcaption>
      </figure>
    </div>
  );
}

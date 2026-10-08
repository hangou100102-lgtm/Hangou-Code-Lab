import { useEffect, useState } from 'react';
import { useT } from '../context/Prefs';
import { IconArrowUp } from './icons';

/* 回到顶部：滚动超过一屏后浮现，点击平滑回到页面顶端。挂在 Layout 上，全站通用。 */
export function BackToTop() {
  const t = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) {
        return;
      }
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setShow(window.scrollY > 400);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  const label = t('回到顶部');

  return (
    <button
      type="button"
      className={show ? 'back-to-top show' : 'back-to-top'}
      aria-label={label}
      title={label}
      onClick={() => {
        const reduced =
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      }}
    >
      <IconArrowUp />
    </button>
  );
}

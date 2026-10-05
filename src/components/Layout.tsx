import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Footer } from './Footer';
import { CookieModal } from './CookieModal';
import { Lightbox } from './Lightbox';
import { Toc } from './Toc';

/* 全局布局：顶栏 + 抽屉 + 页面内容 + 页脚 + Cookie 弹窗 + 图片浮窗 */
export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // 主页顶部已有社交入口，页脚不再重复展示
  const isHome = pathname === '/';

  return (
    <>
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Outlet />
      <Toc />
      <Footer showSocial={!isHome} />
      <CookieModal />
      <Lightbox />
    </>
  );
}

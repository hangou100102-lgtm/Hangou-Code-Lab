import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';
import { Footer } from './Footer';
import { CookieModal } from './CookieModal';
import { Lightbox } from './Lightbox';

/* 全局布局：顶栏 + 抽屉 + 页面内容 + 页脚 + Cookie 弹窗 + 图片浮窗 */
export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Outlet />
      <Footer />
      <CookieModal />
      <Lightbox />
    </>
  );
}

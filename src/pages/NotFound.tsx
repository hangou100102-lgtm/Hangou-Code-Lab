import { useSiteNav } from '../context/SiteNav';
import { En, Zh } from '../components/LangVariant';

/* 找不到的路径：给一句提示和回首页的入口 */
export default function NotFound() {
  const { go } = useSiteNav();

  const home = (e: React.MouseEvent) => {
    e.preventDefault();
    go('/');
  };

  return (
    <main className="post-main container">
      <article>
        <header className="post-header">
          <h1>404</h1>
        </header>

        <Zh>
          <p>没有找到这个页面，可能链接已经失效。可以回到首页看看。</p>
          <p>
            <a href="#/" onClick={home}>
              返回首页
            </a>
          </p>
        </Zh>

        <En>
          <p>We couldn't find this page — the link may be out of date. Head back to the home page.</p>
          <p>
            <a href="#/" onClick={home}>
              Back to home
            </a>
          </p>
        </En>
      </article>
    </main>
  );
}
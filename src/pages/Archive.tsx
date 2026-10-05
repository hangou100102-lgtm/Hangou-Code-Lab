import { useT } from '../context/Prefs';
import { useSiteNav } from '../context/SiteNav';
import { En, TranslateNote, Zh } from '../components/LangVariant';
import { Panel } from '../components/Panel';

export default function Archive() {
  const t = useT();
  const { go } = useSiteNav();

  const nav = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    go(to);
  };

  return (
    <main className="post-main container">
      <Panel className="panel-title" label={t('归档')}>
        <h1>{t('归档')}</h1>
        <div className="post-meta">
          <span className="tags">
            <span className="tag">{t('归档')}</span>
          </span>
        </div>
      </Panel>

      <TranslateNote />

      <Panel title={t('全部内容')}>
        <Zh>
          <div className="archive-group">
            <h2>2026</h2>
            <ul className="archive-list">
              <li>
                <span className="date">2026-09-04</span>
                <a href="#/posts/about" onClick={nav('/posts/about')}>
                  关于我
                </a>
              </li>
            </ul>
          </div>
        </Zh>

        <En>
          <div className="archive-group">
            <h2>2026</h2>
            <ul className="archive-list">
              <li>
                <span className="date">2026-09-04</span>
                <a href="#/posts/about" onClick={nav('/posts/about')}>
                  About me
                </a>
              </li>
            </ul>
          </div>
        </En>
      </Panel>
    </main>
  );
}

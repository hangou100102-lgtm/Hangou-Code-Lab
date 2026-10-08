import { usePrefs, useT } from '../context/Prefs';
import { POSTS, postSearchText } from '../data/posts';
import { PostItem } from '../components/PostItem';
import { TranslateNote } from '../components/LangVariant';
import { useSearch } from '../hooks/useSearch';
import { useViews } from '../hooks/useViews';

/* 站内全部文章路径，用于一次性批量取回浏览数 */
const POST_PATHS = POSTS.map((post) => post.href);

export default function Posts() {
  const t = useT();
  const { lang } = usePrefs();
  const search = useSearch(POSTS, postSearchText);
  const views = useViews(POST_PATHS);

  return (
    <main className="page-main container">
      <section className="panel page-hero">
        <div className="panel-body">
          <h1>
            {lang === 'en' ? (
              <>
                Arti<span className="highlight">cles</span>
              </>
            ) : (
              <>
                文<span className="highlight">章</span>
              </>
            )}
          </h1>
          <p>{t('这里收录站内全部文章，支持标题、标签与摘要关键词搜索。')}</p>
        </div>
      </section>

      <section className="panel" aria-label={t('文章列表')}>
        <div className="panel-body">
          <input
            type="search"
            className="search-input"
            placeholder={t('搜索文章标题、标签或摘要…')}
            autoComplete="off"
            aria-label={t('搜索文章')}
            value={search.value}
            onChange={search.onChange}
            onCompositionStart={search.onCompositionStart}
            onCompositionEnd={search.onCompositionEnd}
          />

          <div className="panel-list-inner">
            <p className="no-result" hidden={search.hasResults}>
              {t('没有找到相关文章，换个关键词试试？')}
            </p>
            <TranslateNote />
            {search.results.map((post) => (
              <PostItem key={post.href} post={post} views={views?.[post.href]} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

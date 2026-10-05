import { usePrefs, useT } from '../context/Prefs';
import { POSTS, postSearchText } from '../data/posts';
import { PostItem } from '../components/PostItem';
import { TranslateNote } from '../components/LangVariant';
import { useSearch } from '../hooks/useSearch';

export default function Posts() {
  const t = useT();
  const { lang } = usePrefs();
  const search = useSearch(POSTS, postSearchText);

  return (
    <main>
      <section className="hero container">
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
      </section>

      <section className="search-wrap container">
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
      </section>

      <section className="post-list container" aria-label={t('文章列表')}>
        <p className="no-result" hidden={search.hasResults}>
          {t('没有找到相关文章，换个关键词试试？')}
        </p>
        <TranslateNote />
        {search.results.map((post) => (
          <PostItem key={post.href} post={post} />
        ))}
      </section>
    </main>
  );
}
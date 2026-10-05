import { useT } from '../context/Prefs';
import { useSiteNav } from '../context/SiteNav';
import { POSTS } from '../data/posts';
import { PostItem } from '../components/PostItem';
import { TranslateNote } from '../components/LangVariant';

export default function Home() {
  const t = useT();
  const { go } = useSiteNav();

  return (
    <main>
      <section className="hero home-hero container">
        <h1>{t('你好，这里是 Hangou')}</h1>
        <p>{t('我是憨狗，写代码也做视频，这里放一些零零散散的想法。')}</p>
      </section>

      <section className="post-list container" aria-label={t('最近文章')}>
        <div className="home-posts-head">
          <h2>{t('最近写的东西')}</h2>
          <a
            href="#/posts"
            onClick={(e) => {
              e.preventDefault();
              go('/posts');
            }}
          >
            {t('全部文章')}
          </a>
        </div>
        <TranslateNote />
        {POSTS.map((post) => (
          <PostItem key={post.href} post={post} />
        ))}
      </section>
    </main>
  );
}
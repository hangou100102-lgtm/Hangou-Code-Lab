import type { Post } from '../data/posts';
import { usePrefs } from '../context/Prefs';
import { useSiteNav } from '../context/SiteNav';
import { En, Zh } from './LangVariant';
import { IconPin, IconClockSmall } from './icons';

/* 摘要截断：中文超过 20 字、英文超过 80 个字符时截断并加省略号，
   完整文本放进 title 便于悬停查看。 */
function clamp(text: string, limit: number): { text: string; title?: string } {
  const t = text.trim();
  if (t.length > limit) {
    return { text: t.slice(0, limit) + '…', title: t };
  }
  return { text: t };
}

/* 单条文章卡片：中英两份内容靠 data-lang-variant 切换显隐 */
export function PostItem({ post }: { post: Post }) {
  const { lang, articleTranslate } = usePrefs();
  const { go } = useSiteNav();
  const zh = clamp(post.excerptZh, 20);
  const en = clamp(post.excerptEn, 80);
  const showEn = articleTranslate && lang === 'en';

  const nav = (e: React.MouseEvent) => {
    e.preventDefault();
    go(post.href);
  };

  /* 整卡可点：内层链接自行 stopPropagation，避免重复跳转 */
  const navCard = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    go(post.href);
  };

  return (
    <article className="post-item" onClick={navCard}>
      <a
        className="post-thumb-link"
        href={'#' + post.href}
        tabIndex={-1}
        aria-hidden="true"
        onClick={nav}
      >
        <img
          className="post-thumb"
          src={post.thumb}
          alt={showEn ? post.altEn : post.altZh}
          loading="lazy"
          width={168}
          height={110}
        />
      </a>
      <div className="post-body">
        <Zh>
          <div className="post-tags-row">
            {post.tagsZh.map((tag) => (
              <span key={tag.label} className={`tag${tag.pin ? ' tag-pin' : ''}`}>
                {tag.pin ? <IconPin /> : '#'}
                {tag.label}
              </span>
            ))}
            <span className="date">
              <IconClockSmall />
              {post.date}
            </span>
          </div>
          <h2>
            <a href={'#' + post.href} onClick={nav}>
              {post.titleZh}
            </a>
          </h2>
          <p className="post-excerpt" title={zh.title}>
            {zh.text}
          </p>
        </Zh>
        <En>
          <div className="post-tags-row">
            {post.tagsEn.map((tag) => (
              <span key={tag.label} className={`tag${tag.pin ? ' tag-pin' : ''}`}>
                {tag.pin ? <IconPin /> : '#'}
                {tag.label}
              </span>
            ))}
            <span className="date">
              <IconClockSmall />
              {post.date}
            </span>
          </div>
          <h2>
            <a href={'#' + post.href} onClick={nav}>
              {post.titleEn}
            </a>
          </h2>
          <p className="post-excerpt" title={en.title}>
            {en.text}
          </p>
        </En>
      </div>
    </article>
  );
}
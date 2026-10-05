import { useT } from '../context/Prefs';
import { useSiteNav } from '../context/SiteNav';
import { POSTS } from '../data/posts';
import { PostItem } from '../components/PostItem';
import { En, TranslateNote, Zh } from '../components/LangVariant';
import { IconAifadian, IconBilibili, IconGithub } from '../components/icons';

const CIOS_LINK = 'https://s.hortorinteractive.com/K4ZK47';

export default function Home() {
  const t = useT();
  const { go } = useSiteNav();

  return (
    <main className="home-main container">
      <section className="panel home-hero">
        <div className="panel-body">
          <h1>{t('你好，这里是 Hangou')}</h1>
          <p>{t('我是憨狗，写代码也做视频，这里放一些零零散散的想法。')}</p>
          <div className="hero-social">
            <a
              className="social-btn"
              href="https://space.bilibili.com/1937945301"
              target="_blank"
              rel="noopener"
              aria-label={t('B站主页')}
              title={t('B站主页')}
            >
              <IconBilibili />
              <span>{t('哔哩哔哩')}</span>
            </a>
            <a
              className="social-btn"
              href="https://github.com/hangou100102-lgtm"
              target="_blank"
              rel="noopener"
              aria-label={t('GitHub主页')}
              title={t('GitHub主页')}
            >
              <IconGithub />
              <span>GitHub</span>
            </a>
            <a
              className="social-btn"
              href="https://ifdian.net/a/hangou100102"
              target="_blank"
              rel="noopener"
              aria-label={t('爱发电主页')}
              title={t('爱发电主页')}
            >
              <IconAifadian />
              <span>{t('爱发电')}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="panel" aria-label={t('我的项目 Ci OS')}>
        <div className="panel-head">
          <h2>{t('我的项目 · Ci OS')}</h2>
        </div>
        <div className="panel-body">
          <Zh>
            <p>
              <strong>Ci OS</strong> 是我在<strong>创游世界</strong>
              上做的一个「伪系统」项目，也是我目前唯一一个出圈的作品。
            </p>
            <p>
              它出过很多版本：有海外创游世界的 1 代国际版，也有国内的 1 代与 2 代。最早的版本始于
              <strong>2024 年 7 月 10 日</strong>的 1 代国际版，当时主要还原了 iOS
              的桌面动效与其他细节；后来转向了<strong>小米澎湃 OS</strong>
              的动效和风格，同时保留了一些 iOS 的优秀元素。
            </p>
            <p>
              直到 <strong>2026 年 5 月 15 日</strong>
              ，最后一个 2 代版本宣布停更。不过这个社区的玩家们现在还在不断地创新技术，让「创游伪
              OS」做得越来越好。
            </p>
            <p>
              作品链接：
              <a href={CIOS_LINK} target="_blank" rel="noopener">
                {CIOS_LINK}
              </a>
            </p>
          </Zh>

          <En>
            <p>
              <strong>Ci OS</strong> is a "fake system" project I built in{' '}
              <strong>Chuangyou Shijie</strong> (创游世界), and so far it's the one work of mine that
              really caught on.
            </p>
            <p>
              It went through many versions: a first-generation international release on the overseas
              Chuangyou Shijie, plus the first and second generations in China. The earliest version
              dates back to <strong>10 July 2024</strong>, when it mainly recreated iOS home-screen
              animations and other details. It later shifted towards the animations and style of{' '}
              <strong>Xiaomi HyperOS</strong> while keeping some of the best iOS elements.
            </p>
            <p>
              The last second-generation version was discontinued on <strong>15 May 2026</strong>.
              Even so, players in this community keep innovating and pushing the "Chuangyou fake OS"
              further.
            </p>
            <p>
              Project link:{' '}
              <a href={CIOS_LINK} target="_blank" rel="noopener">
                {CIOS_LINK}
              </a>
            </p>
          </En>
        </div>
      </section>

      <section className="panel" aria-label={t('最近文章')}>
        <div className="panel-head">
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
        <div className="panel-body">
          <TranslateNote />
          {POSTS.map((post) => (
            <PostItem key={post.href} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}

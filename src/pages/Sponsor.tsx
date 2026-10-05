import { useT } from '../context/Prefs';

export default function Sponsor() {
  const t = useT();

  return (
    <main className="post-main container sponsor-page">
      <article>
        <header className="post-header">
          <h1>{t('支持 Hangou')}</h1>
          <div className="post-meta">
            <span className="tag">{t('赞助')}</span>
          </div>
        </header>

        <div className="article-body">
          <p>
            {t('如果我的文章、项目或分享对你有帮助，欢迎通过爱发电支持我。每一份支持都会成为继续创作的动力。')}
          </p>
        </div>

        <section className="sponsor-box" aria-labelledby="sponsor-title">
          <h2 id="sponsor-title">{t('支持创作')}</h2>
          <p>{t('点击下面的按钮前往爱发电完成赞助。')}</p>
          <a
            className="sponsor-action"
            href="https://ifdian.net/order/create?plan_id=bf2213faa86511f1a6555254001e7c00&product_type=0&remark=&affiliate_code="
            target="_blank"
            rel="noopener"
          >
            {t('前往爱发电赞助')}
          </a>
        </section>

        <section className="sponsor-list" aria-labelledby="sponsor-list-title">
          <h2 id="sponsor-list-title">{t('赞助列表')}</h2>
          <div className="sponsor-empty">{t('赞助名单整理中，感谢每一位支持者～')}</div>
        </section>
      </article>
    </main>
  );
}
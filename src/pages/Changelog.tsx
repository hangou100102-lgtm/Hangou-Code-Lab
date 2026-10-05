import { useT } from '../context/Prefs';
import { En, TranslateNote, Zh } from '../components/LangVariant';
import { Panel } from '../components/Panel';

interface Entry {
  date: string;
  text: string;
}

const ENTRIES_ZH: Entry[] = [
  { date: '2026-10-05', text: '全站内容板块化：各页面内容拆成独立卡片板块，标题保留在页面背景上' },
  { date: '2026-10-05', text: '首页新增「我的项目 · Ci OS」板块，介绍创游世界伪系统作品的版本与停更历程' },
  { date: '2026-10-05', text: '首页问候语下新增 B站 / GitHub / 爱发电 社交入口，主页页脚不再重复展示' },
  { date: '2026-10-05', text: '文章卡片整卡可点击跳转，不再局限于标题与预览图' },
  { date: '2026-10-05', text: '搜索框改为浅底加描边，与板块背景拉开对比；评论框样式同步对齐站点风格' },
  { date: '2026-10-05', text: '关于页联系方式精简为三个常用邮箱' },
  { date: '2026-09-26', text: '外观新增「跟随系统」选项：设置页「主题」下可选深色 / 浅色 / 跟随系统，选择跟随系统后随系统外观自动切换' },
  { date: '2026-09-26', text: '全文翻译扩大到全站：设置页「语言」下可开启，界面语言为 English 时站内各处的文字都显示英文版本（AI 辅助翻译，可能出现偏差）' },
  { date: '2026-09-26', text: '新增设置页：界面语言可选中文 / English，外观可选深色 / 浅色，Cookie 提示可选每次询问或不再提示，偏好保存在本机浏览器' },
  { date: '2026-09-26', text: '隐私政策更新：补充界面语言偏好（hcl-lang）的说明，并标注各项本地偏好的调整入口' },
  { date: '2026-09-25', text: '顶栏左右留白对齐：修正右侧主题图标因按钮点击区留白导致的视觉内缩，让图标边缘与左侧头像落在同一条留白线上' },
  { date: '2026-09-25', text: '导航栏改版：品牌贴左边、入口居中，右侧只留主题切换按钮，左右留白随窗口拉伸始终贴住两侧' },
  { date: '2026-09-25', text: '文章页接入 giscus 评论，用 GitHub Discussions 存评论，登录 GitHub 后可发言' },
  { date: '2026-09-25', text: '首页精简：去掉入口卡片与按钮，只留一句介绍和最近文章，其余入口收到导航栏' },
  { date: '2026-09-21', text: '新增「更新日志」页面' },
  { date: '2026-09-21', text: '站点视觉改版：全站改为直角风格，取消圆角与渐变色' },
  { date: '2026-09-19', text: '更新 GitHub 友链信息，保留各友链原有跳转地址' },
  { date: '2026-09-06', text: '首页改为欢迎主页，文章列表拆分为独立页面' },
  { date: '2026-09-06', text: '关于页新增邮箱，优化日期展示' },
  { date: '2026-09-05', text: '新增独立赞助页与赞助列表' },
  { date: '2026-09-05', text: '友链页新增模糊搜索' },
  { date: '2026-09-05', text: '新增侧栏导航与归档页' },
  { date: '2026-09-05', text: '主题切换改为整页过渡，新增加载中遮罩' },
  { date: '2026-09-04', text: '首页新增模糊搜索' },
  { date: '2026-09-04', text: '文章图片支持浮窗预览（毛玻璃、缩放动画、下载）' },
  { date: '2026-09-04', text: '新增「关于我」页面，文章列表卡片增加预览图' },
  { date: '2026-09-04', text: '新增深浅主题切换按钮，导航改为全屏通栏' },
  { date: '2026-09-04', text: '页脚新增 B站 / GitHub / 爱发电 入口' },
  { date: '2026-09-03', text: '文章改为目录式 URL，站内链接去掉 .html 后缀' },
  { date: '2026-09-03', text: '使用头像作为站点 logo 与 favicon' },
  { date: '2026-09-03', text: '更换自定义域名为 blog.hangou.top' }
];

const ENTRIES_EN: Entry[] = [
  { date: '2026-10-05', text: 'Site-wide content panels: each page\'s content is split into separate card panels, while page titles stay on the page background' },
  { date: '2026-10-05', text: 'Added a "My project · Ci OS" panel to the home page, covering the versions and discontinuation of the fake-OS project on Chuangyou Shijie' },
  { date: '2026-10-05', text: 'Added Bilibili / GitHub / Afdian social links under the home intro; the home footer no longer repeats them' },
  { date: '2026-10-05', text: 'Post cards are now clickable as a whole, not just the title and thumbnail' },
  { date: '2026-10-05', text: 'The search box gained a soft background and border for contrast against the panels; the comment box style was aligned with the site too' },
  { date: '2026-10-05', text: 'Trimmed the contact addresses on the About page down to three primary emails' },
  { date: '2026-09-26', text: 'Added a "System" appearance option: the Theme group on the Settings page now offers dark / light / system, and the system option follows your OS appearance automatically' },
  { date: '2026-09-26', text: 'Full-text translation now covers the whole site: enable it under "Language" on the Settings page, and when the interface language is English the text across the site is shown in an English version (AI-assisted; may contain inaccuracies)' },
  { date: '2026-09-26', text: 'Added a Settings page: interface language in Chinese / English, appearance in dark / light, cookie notice either every visit or skipped, with preferences saved in your local browser' },
  { date: '2026-09-26', text: 'Privacy policy update: added notes on the interface-language preference (hcl-lang) and pointed out where each local preference can be changed' },
  { date: '2026-09-25', text: 'Header padding alignment: fixed the visual inset of the theme icon on the right caused by its button hit-area padding, so the icon edge lines up with the avatar on the left' },
  { date: '2026-09-25', text: 'Navigation redesign: brand pinned left, entries centred, only the theme toggle on the right, with the outer margins staying flush to both sides as the window resizes' },
  { date: '2026-09-25', text: 'Added giscus comments to post pages, storing comments in GitHub Discussions — sign in with GitHub to post' },
  { date: '2026-09-25', text: 'Streamlined the home page: removed the entry cards and buttons, leaving just a one-line intro and recent posts, with the other entries moved into the nav bar' },
  { date: '2026-09-21', text: 'Added a "Changelog" page' },
  { date: '2026-09-21', text: 'Site visual refresh: the whole site switched to square corners, dropping rounded corners and gradients' },
  { date: '2026-09-19', text: 'Updated GitHub friend-link details, keeping each friend\'s original destination URL' },
  { date: '2026-09-06', text: 'The home page became a welcome page, and the post list moved to its own page' },
  { date: '2026-09-06', text: 'Added email addresses to the About page and improved how dates are displayed' },
  { date: '2026-09-05', text: 'Added a standalone sponsor page and sponsor list' },
  { date: '2026-09-05', text: 'Added fuzzy search to the friends page' },
  { date: '2026-09-05', text: 'Added side-drawer navigation and an archive page' },
  { date: '2026-09-05', text: 'Theme switching became a full-page transition, with a new loading overlay' },
  { date: '2026-09-04', text: 'Added fuzzy search to the home page' },
  { date: '2026-09-04', text: 'Post images support a floating preview (frosted glass, zoom animation, download)' },
  { date: '2026-09-04', text: 'Added an "About me" page, and post-list cards gained preview images' },
  { date: '2026-09-04', text: 'Added a dark/light theme toggle button, and the nav became a full-width bar' },
  { date: '2026-09-04', text: 'Added Bilibili / GitHub / Afdian links to the footer' },
  { date: '2026-09-03', text: 'Posts moved to directory-style URLs, and internal links dropped the .html suffix' },
  { date: '2026-09-03', text: 'Used the avatar as the site logo and favicon' },
  { date: '2026-09-03', text: 'Switched the custom domain to blog.hangou.top' }
];

function Group({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <div className="archive-group">
      <h2>{title}</h2>
      <ul className="archive-list">
        {entries.map((e, i) => (
          <li key={e.date + i}>
            <span className="date">{e.date}</span>
            <span>{e.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Changelog() {
  const t = useT();

  return (
    <main className="post-main container">
      <Panel className="panel-title" label={t('更新日志')}>
        <h1>{t('更新日志')}</h1>
        <div className="post-meta">
          <span className="tags">
            <span className="tag">{t('更新日志')}</span>
          </span>
        </div>
      </Panel>

      <TranslateNote />

      <Panel title={t('更新记录')}>
        <Zh>
          <Group title="2026 年 9 月" entries={ENTRIES_ZH} />
        </Zh>

        <En>
          <Group title="September 2026" entries={ENTRIES_EN} />
        </En>
      </Panel>
    </main>
  );
}
import { usePrefs } from '../context/Prefs';
import { TRANSLATE_NOTE } from '../i18n/phrases';

/* 双语变体容器：中文/英文两份内容靠 data-lang-variant + CSS 切换显隐，
   与旧站保持一致（不改为条件渲染）。
   可选 className 用于在一份内容上挂载正文排版样式（如 article-body）。 */
export function Zh({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-lang-variant="zh" className={className}>
      {children}
    </div>
  );
}

export function En({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-lang-variant="en" lang="en" className={className}>
      {children}
    </div>
  );
}

/* 全文翻译开启且界面语言为英文时，在被翻译内容前插入免责提示 */
export function TranslateNote() {
  const { lang, articleTranslate } = usePrefs();
  if (!(articleTranslate && lang === 'en')) {
    return null;
  }
  return <p className="translate-note">{TRANSLATE_NOTE}</p>;
}

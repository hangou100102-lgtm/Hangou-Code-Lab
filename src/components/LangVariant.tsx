import { usePrefs } from '../context/Prefs';
import { TRANSLATE_NOTE } from '../i18n/phrases';

/* 双语变体容器：中文/英文两份内容靠 data-lang-variant + CSS 切换显隐，
   与旧站保持一致（不改为条件渲染）。 */
export function Zh({ children }: { children: React.ReactNode }) {
  return <div data-lang-variant="zh">{children}</div>;
}

export function En({ children }: { children: React.ReactNode }) {
  return (
    <div data-lang-variant="en" lang="en">
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
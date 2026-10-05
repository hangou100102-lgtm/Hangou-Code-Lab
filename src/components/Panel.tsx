/* 板块：页面内容卡片化的统一容器。
   - 无标题栏（仅 .panel）：正文直接放进 panel-body
   - 带标题栏：传 title / action 即可渲染 .panel-head
   全站圆角为 0，样式见 css/style.css 的「板块」段落。 */
export function Panel({
  title,
  action,
  children,
  className = '',
  label
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <section className={'panel' + (className ? ' ' + className : '')} aria-label={label}>
      {(title || action) && (
        <div className="panel-head">
          {title && <h2>{title}</h2>}
          {action}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

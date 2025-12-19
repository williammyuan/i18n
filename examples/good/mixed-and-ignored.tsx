declare function t(text: string): string;

export function GoodMixedAndIgnored() {
  // 注释里的中文（不会被规则检测）
  // 这是一段注释中文

  // console 里的中文（会被忽略，不应报错）
  console.log("调试信息：用户登录成功");
  console.warn("警告：网络连接异常");

  // 其他中文需要 t() 包裹
  const label = t('按钮');

  return (
    <div>
      <span>{label}</span>
      <span>{t('状态：')}{t('在线')}</span>
    </div>
  );
}








export function BadBasic() {
  const title = t('欢迎使用');
  const error = t('操作失败，请重试');

  return (
    <div>
      <h1>{t('标题')}</h1>
      <p>{t('这是一段中文描述')}</p>
      <button title={t('提交按钮')}>{t('提交')}</button>
      <div>{title}</div>
      <div>{error}</div>
    </div>
  );
}



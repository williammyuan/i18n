export function BadBasic() {
  const title = t('欢迎使用');
  const error = t('操作失败，请重试');
  console.log("调试信息：用户登录成功");
  console.warn("警告：网络连接异常");
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



# Examples

这里提供了**可直接对照**的示例代码，分为：

- `examples/bad/`：会触发 `react-i18n-t/no-chinese-text`
- `examples/good/`：符合规则，不会触发

## 示例 ESLint 配置

> 适用于把本仓库作为本地依赖/或发布到 npm 后使用。

```json
{
  "plugins": ["react-i18n-t"],
  "rules": {
    "react-i18n-t/no-chinese-text": "warn"
  }
}
```

## 自动修复

如果你开启保存自动修复或手动执行：

```bash
npm run examples:fix
```

规则会把中文文本自动包裹成 `t('...')` / `{t('...')}`（JSX 场景）。
为了保留 bad/good 对照，`examples:fix` **不会直接改写 `examples/bad/`**，而是把修复结果输出到：

- `examples/good/_autofix/`

## 为什么打开 bad 文件没有提示？

`examples/` 只是示例代码目录，编辑器只有在 **ESLint 插件成功加载本项目的规则** 时才会提示/修复。

在本仓库里，推荐直接用命令验证：

```bash
# bad：会有告警（用于演示），但命令会通过
npm run examples:lint:bad

# good：必须 0 告警（用于保证示例正确），否则失败
npm run examples:lint:good

# 两者一起校验
npm run examples:check

# 从 examples/bad 生成修复结果到 examples/good/_autofix
npm run examples:fix
```



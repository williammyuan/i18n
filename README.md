# @kfb/i18n-t

[![npm version](https://badge.fury.io/js/%40kfb%2Fi18n-t.svg)](https://www.npmjs.com/package/@kfb/i18n-t)
[![CI](https://github.com/你的用户名/仓库名/workflows/CI/badge.svg)](https://github.com/你的用户名/仓库名/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🔍 ESLint 插件：自动检测 React 代码中的中文文本，要求使用 `t()` 包裹，支持一键自动修复。

## ✨ 特性

- 🎯 **精准检测** - 识别 JSX 文本、字符串字面量、模板字符串中的中文
- 🔧 **自动修复** - 支持 `eslint --fix` 一键自动包裹中文文本
- ⚙️ **灵活配置** - 可自定义国际化函数名（默认 `t()`）
- 🚀 **轻量依赖** - 仅依赖 ESLint 7+，无额外运行时依赖
- 📝 **TypeScript** - 使用 TypeScript 编写，提供完整类型支持
- 🎨 **智能忽略** - 自动忽略 console 日志和已包裹的文本

## 📦 安装

```bash
npm install @kfb/i18n-t --save-dev
# 或
yarn add @kfb/i18n-t -D
# 或
pnpm add @kfb/i18n-t -D
```

## 🚀 快速开始

### 1. 基础配置

在 `.eslintrc.json` 中启用插件和规则：

```json
{
  "plugins": ["@kfb/i18n-t"],
  "rules": {
    "@kfb/i18n-t/no-chinese-text": "warn"
  }
}
```

### 2. 自定义配置

默认使用 `t()` 包裹中文文本，可自定义函数名：

```json
{
  "rules": {
    "@kfb/i18n-t/no-chinese-text": ["warn", { "fnName": "translate" }]
  }
}
```

### 3. 运行检查

```bash
# 检查代码
npx eslint src/

# 自动修复
npx eslint src/ --fix
```

## 📖 规则说明：`no-chinese-text`

### 检测范围

- ✅ JSX 文本节点中的中文
- ✅ 字符串字面量中的中文
- ✅ 无插值的模板字符串中的中文
- ✅ JSX 属性值中的中文字符串

### 自动修复行为

- JSX 文本：`<div>中文</div>` → `<div>{t('中文')}</div>`
- 字符串字面量：`const text = "中文"` → `const text = t('中文')`
- 模板字符串：`const text = \`中文\`` → `const text = t('中文')`

### 自动忽略

- ❌ `console.*` 调用中的中文（调试日志）
- ❌ 已经使用 `t()` 包裹的文本
- ❌ 注释中的中文
- ❌ 纯英文和数字

## 📝 使用示例

### ❌ 错误示例（触发规则）

```jsx
// 字符串字面量中的中文
const title = "欢迎使用";
const message = `您好，世界`;

// JSX 文本中的中文
function Component() {
  return (
    <div>
      <h1>标题</h1>
      <p>这是一段中文描述</p>
      <button title="提交按钮">提交</button>
    </div>
  );
}

// 模板字符串中的中文（无插值）
const errorMsg = `操作失败，请重试`;
```

### ✅ 正确示例（不触发规则）

```jsx
// 已经使用 t() 包裹
const title = t('欢迎使用');
const message = t('您好，世界');

// JSX 文本已经包裹
function Component() {
  return (
    <div>
      <h1>{t('标题')}</h1>
      <p>{t('这是一段中文描述')}</p>
      <button title={t('提交按钮')}>{t('提交')}</button>
    </div>
  );
}

// console.log 中的中文（会被忽略）
console.log("调试信息：用户登录成功");
console.warn("警告：网络连接异常");

// 注释中的中文（不会被检测）
// 这是一个注释，包含中文文本
const code = "/* 注释：这是中文注释 */";

// 英文和数字不会触发
const english = "Hello World";
const numbers = "123456";
```

### 🔧 自动修复示例

**修复前：**
```jsx
function UserProfile({ name }) {
  const greeting = "欢迎回来";
  return (
    <div>
      <h2>用户信息</h2>
      <p>姓名：{name}</p>
      <span>状态：在线</span>
    </div>
  );
}
```

**修复后：**
```jsx
function UserProfile({ name }) {
  const greeting = t('欢迎回来');
  return (
    <div>
      <h2>{t('用户信息')}</h2>
      <p>{t('姓名：')}{name}</p>
      <span>{t('状态：')}{t('在线')}</span>
    </div>
  );
}
```

### ⚙️ 自定义函数名示例

**配置：**
```json
{
  "rules": {
    "@kfb/i18n-t/no-chinese-text": ["warn", { "fnName": "i18n" }]
  }
}
```

**修复后：**
```jsx
function Component() {
  return <div>{i18n('中文内容')}</div>;
}
```

## 🔧 配置选项

### `fnName`

指定国际化函数名称，默认为 `t`。

```json
{
  "rules": {
    "@kfb/i18n-t/no-chinese-text": ["warn", { "fnName": "i18n" }]
  }
}
```

## 🌟 最佳实践

### 1. 与 ESLint 配置集成

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["@kfb/i18n-t"],
  "rules": {
    "@kfb/i18n-t/no-chinese-text": "error"
  }
}
```

### 2. 在 CI/CD 中使用

项目已配置 GitHub Actions，会自动在 PR 和 push 时运行检查。

### 3. 团队协作建议

- 在 `package.json` 中添加 lint 脚本
- 使用 `pre-commit` hook 确保代码提交前通过检查
- 设置为 `error` 级别强制执行国际化规范

## 💻 开发

### 环境要求

- Node.js >= 14
- npm >= 6

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/仓库名.git
cd 仓库名

# 安装依赖
npm install

# 构建项目
npm run build

# 运行示例检查
npm run examples:check

# 自动修复示例
npm run examples:fix

# 代码检查
npm run lint
```

### 项目结构

```
.
├── src/                    # 源代码
│   ├── index.ts           # 插件入口
│   └── rules/             # 规则实现
│       └── no-chinese-text.ts
├── dist/                  # 编译产物（构建生成）
├── examples/              # 示例代码
│   ├── bad/              # 错误示例
│   └── good/             # 正确示例
├── .github/
│   └── workflows/        # GitHub Actions
│       ├── ci.yml        # 持续集成
│       └── release.yml   # 自动发布
└── package.json
```

## 📦 发布流程

本项目使用 GitHub Actions 自动发布到 NPM：

```bash
# 1. 更新版本号
npm version patch  # 或 minor / major

# 2. 推送 tag 触发自动发布
git push origin v0.1.1
```

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [NPM Package](https://www.npmjs.com/package/@kfb/i18n-t)
- [GitHub Repository](https://github.com/你的用户名/仓库名)
- [Issues](https://github.com/你的用户名/仓库名/issues)

## ⚡ 兼容性

- **Node.js**: >= 14
- **ESLint**: >= 7
- **React**: JSX/TSX 项目

## 📊 版本历史

### v0.1.0 (2024-12-14)

- 🎉 首次发布
- ✨ 支持检测 JSX 文本、字符串字面量中的中文
- 🔧 支持自动修复
- ⚙️ 支持自定义函数名

---

Made with ❤️ by [Your Name]

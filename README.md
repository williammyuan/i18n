# eslint-plugin-react-i18n-t

> 检测 React 代码中的中文文本，要求使用 `t()` 包裹，支持自动修复。仅依赖 ESLint 7+。

## 安装

```bash
npm install eslint eslint-plugin-react-i18n-t --save-dev
# 或
yarn add eslint eslint-plugin-react-i18n-t -D
```

## 使用

在 `.eslintrc` 中启用插件和规则：

```json
{
  "plugins": ["react-i18n-t"],
  "rules": {
    "react-i18n-t/no-chinese-text": "warn"
  }
}
```

默认使用 `t()` 包裹中文文本，可在规则配置中自定义函数名：

```json
{
  "rules": {
    "react-i18n-t/no-chinese-text": ["warn", { "fnName": "translate" }]
  }
}
```

## 规则说明：`no-chinese-text`

- 检测 JSX 文本、字符串字面量、无插值的模板字符串中的中文。
- 自动修复：将中文文本替换为 `{t('文本')}` 或 `t('文本')`。
- 忽略：
  - `console.*` 里的中文
  - 已经包裹在 `t()`（或自定义 `fnName`）中的文本
  - 注释（AST 不会报告注释内容）

### 示例

#### 错误示例（触发规则）

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

#### 正确示例（不触发规则）

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

#### 自动修复示例

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

#### 自定义函数名示例

配置：
```json
{
  "rules": {
    "react-i18n-t/no-chinese-text": ["warn", { "fnName": "i18n" }]
  }
}
```

修复后：
```jsx
function Component() {
  return <div>{i18n('中文内容')}</div>;
}
```

### 兼容性

- 仅依赖 ESLint 7+，React 项目（JSX/TSX）。
- 规则使用 TypeScript 编写，`npm run build` 生成 `dist`。

## 开发

```bash
npm install
npm run build
```

发布到 npm 前请执行 `npm run build` 生成编译产物。可以在 GitHub Actions 中添加 `npm test`/`npm run lint` 以保证规则质量。


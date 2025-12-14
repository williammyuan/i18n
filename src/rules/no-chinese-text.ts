import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';

type Options = [
  {
    /**
     * 包裹中文文本的函数名，默认 t。
     */
    fnName?: string;
  }?
];

type MessageIds = 'wrapWithT';

const createRule = ESLintUtils.RuleCreator(
  (name: string) =>
    `https://github.com/your-org/eslint-plugin-react-i18n-t/blob/main/docs/rules/${name}.md`,
);

const CHINESE_REGEX = /[\u4e00-\u9fff]/;

const hasChinese = (text: string) => CHINESE_REGEX.test(text);

const escapeForSingleQuote = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const buildCall = (fnName: string, text: string) =>
  `${fnName}('${escapeForSingleQuote(text)}')`;

const isConsoleCall = (
  ancestors: TSESTree.Node[],
): TSESTree.CallExpression | null => {
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const node = ancestors[i];
    if (node.type !== 'CallExpression') continue;
    const callee = node.callee;
    if (
      callee.type === 'MemberExpression' &&
      !callee.computed &&
      callee.object.type === 'Identifier' &&
      callee.object.name === 'console'
    ) {
      return node;
    }
  }
  return null;
};

const isTargetWrapperCall = (
  ancestors: TSESTree.Node[],
  fnName: string,
): boolean => {
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const node = ancestors[i];
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === fnName
    ) {
      return true;
    }
  }
  return false;
};

const textFromTemplateLiteral = (node: TSESTree.TemplateLiteral): string => {
  if (node.expressions.length > 0 || node.quasis.length !== 1) {
    return '';
  }
  return node.quasis[0].value.cooked ?? '';
};

export default createRule<Options, MessageIds>({
  name: 'no-chinese-text',
  meta: {
    type: 'problem',
    docs: {
      description:
        '检测 React 代码中的中文文本并要求使用 t() 包裹，支持自动修复。',
      recommended: 'recommended',
      requiresTypeChecking: false,
    },
    messages: {
      wrapWithT: '检测到中文文本，请使用 t() 包裹后再使用（例如：t(\'{{text}}\')）。',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          fnName: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context: TSESLint.RuleContext<MessageIds, Options>) {
    const [{ fnName = 't' } = {}] = context.options;

    const shouldIgnore = (node: TSESTree.Node): boolean => {
      const ancestors = context.getAncestors();
      if (isConsoleCall(ancestors)) return true;
      if (isTargetWrapperCall(ancestors, fnName)) return true;
      return false;
    };

    const reportNode = (
      node: TSESTree.Node,
      rawText: string,
      fix?: TSESLint.ReportFixFunction,
    ) => {
      const normalized = rawText.trim() || rawText;
      context.report({
        node,
        messageId: 'wrapWithT',
        data: { text: normalized },
        fix,
      });
    };

    const handleLiteral = (node: TSESTree.Literal) => {
      if (typeof node.value !== 'string') return;
      const text = node.value;
      if (!hasChinese(text)) return;
      if (shouldIgnore(node)) return;

      const parent = node.parent;
      const fixer: TSESLint.ReportFixFunction = (fixerApi: TSESLint.RuleFixer) => {
        const replacement = buildCall(fnName, text);
        if (parent?.type === 'JSXAttribute') {
          return fixerApi.replaceText(node, `{${replacement}}`);
        }
        return fixerApi.replaceText(node, replacement);
      };

      reportNode(node, text, fixer);
    };

    const handleTemplateLiteral = (node: TSESTree.TemplateLiteral) => {
      const text = textFromTemplateLiteral(node);
      if (!text || !hasChinese(text)) return;
      if (shouldIgnore(node)) return;

      const fixer: TSESLint.ReportFixFunction = (fixerApi: TSESLint.RuleFixer) =>
        fixerApi.replaceText(node, buildCall(fnName, text));

      reportNode(node, text, fixer);
    };

    const handleJSXText = (node: TSESTree.JSXText) => {
      const raw = node.value;
      if (!hasChinese(raw)) return;
      if (shouldIgnore(node)) return;

      const leading = raw.match(/^\s*/)?.[0] ?? '';
      const trailing = raw.match(/\s*$/)?.[0] ?? '';
      const content = raw.trim();
      if (!content) return;

      const fixer: TSESLint.ReportFixFunction = (fixerApi: TSESLint.RuleFixer) =>
        fixerApi.replaceText(
          node,
          `${leading}{${buildCall(fnName, content)}}${trailing}`,
        );

      reportNode(node, content, fixer);
    };

    return {
      Literal: handleLiteral,
      TemplateLiteral: handleTemplateLiteral,
      JSXText: handleJSXText,
    };
  },
});


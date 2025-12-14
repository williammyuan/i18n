import noChineseText from './rules/no-chinese-text';

export const rules = {
  'no-chinese-text': noChineseText,
};

export const configs = {
  recommended: {
    plugins: ['react-i18n-t'],
    rules: {
      'react-i18n-t/no-chinese-text': 'warn',
    },
  },
};

export default {
  rules,
  configs,
};


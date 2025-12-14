/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const { ESLint } = require('eslint');

async function main() {
  const argv = process.argv.slice(2);
  const shouldFix = argv.includes('--fix');
  const strict = argv.includes('--strict');
  const targetArg = argv.find((a) => a.startsWith('--target='));
  const target = targetArg ? targetArg.split('=')[1] : 'bad';

  const plugin = require(path.resolve(__dirname, '../dist/index.js'));

  const eslint = new ESLint({
    cwd: path.resolve(__dirname, '..'),
    fix: shouldFix,
    useEslintrc: false,
    overrideConfig: {
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: ['react-i18n-t'],
      rules: {
        'react-i18n-t/no-chinese-text': 'warn',
      },
    },
    plugins: {
      'react-i18n-t': plugin,
    },
  });

  const patterns =
    target === 'good'
      ? ['examples/good/**/*.{ts,tsx,js,jsx}']
      : target === 'both'
        ? ['examples/bad/**/*.{ts,tsx,js,jsx}', 'examples/good/**/*.{ts,tsx,js,jsx}']
        : ['examples/bad/**/*.{ts,tsx,js,jsx}'];
  const results = await eslint.lintFiles(patterns);

  if (shouldFix) {
    // 不要覆盖 examples/bad：把修复后的内容写到 examples/good/_autofix
    for (const r of results) {
      if (!r.output) continue;
      const rel = path.relative(path.resolve(__dirname, '..'), r.filePath);
      const normalizedRel = rel.split(path.sep).join('/');
      if (!normalizedRel.startsWith('examples/bad/')) continue;

      const outRel = normalizedRel.replace(
        /^examples\/bad\//,
        'examples/good/_autofix/',
      );
      const outAbs = path.resolve(__dirname, '..', outRel);
      fs.mkdirSync(path.dirname(outAbs), { recursive: true });
      fs.writeFileSync(outAbs, r.output, 'utf8');
    }
  }

  const formatter = await eslint.loadFormatter('stylish');
  const output = formatter.format(results);
  if (output.trim()) console.log(output);

  const errorCount = results.reduce((sum, r) => sum + (r.errorCount || 0), 0);
  const warningCount = results.reduce((sum, r) => sum + (r.warningCount || 0), 0);
  if (errorCount > 0) {
    process.exitCode = 1;
    return;
  }
  if (strict && warningCount > 0) {
    process.exitCode = 1;
    return;
  }
  process.exitCode = 0;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 2;
});



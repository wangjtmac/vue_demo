module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 禁止在对象中出现重复的键
    'no-dupe-keys': 'error',
    // 禁止在变量声明中出现重复的变量名
    'no-redeclare': 'error',
    // Vue 特定规则
    'vue/no-dupe-keys': 'error',
    'vue/no-duplicate-attributes': 'error',
    'vue/no-parsing-error': 'error'
  }
}

/**
 * ESLint 配置文件
 * 用于 Vue2 项目的代码规范检查
 *
 * @module .eslintrc
 * @description 配置 ESLint 规则以保持代码质量和一致性
 *
 * ==================== ESLint 与 Prettier 职责分工 ====================
 *
 * ESLint 负责检查：
 * - 代码质量（未使用变量、重复声明等）
 * - 潜在错误（未定义变量、类型错误等）
 * - 最佳实践（避免危险函数、代码规范等）
 * - Vue 特定规则（组件命名、生命周期等）
 *
 * Prettier 负责格式化：
 * - 缩进（2个空格）
 * - 引号（单引号）
 * - 分号（不使用分号）
 * - 空格和换行
 * - 尾随逗号（不使用）
 * - HTML/模板格式
 *
 * 注意：所有格式化相关的 ESLint 规则已关闭，避免与 Prettier 冲突
 */

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
    // ==================== JavaScript 基础规则 ====================

    // 禁止在对象中出现重复的键
    'no-dupe-keys': 'error',

    // 禁止在变量声明中出现重复的变量名
    'no-redeclare': 'error',

    // 禁止使用未声明的变量
    'no-undef': 'error',

    // 禁止使用未使用的变量
    'no-unused-vars': ['warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false
    }],

    // 禁止使用 console，建议在开发环境使用 warn
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 禁止使用 debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 引号规则交由 Prettier 处理，ESLint 不检查
    'quotes': 'off',

    // 分号规则交由 Prettier 处理，ESLint 不检查
    'semi': 'off',

    // 缩进规则交由 Prettier 处理，ESLint 不检查
    'indent': 'off',

    // 函数括号内空格规则交由 Prettier 处理，ESLint 不检查
    'space-before-function-paren': 'off',

    // 末尾空格规则交由 Prettier 处理，ESLint 不检查
    'no-trailing-spaces': 'off',

    // 多余空行规则交由 Prettier 处理，ESLint 不检查
    'no-multiple-empty-lines': 'off',

    // 强制在代码块中使用大括号
    'curly': ['error', 'all'],

    // 禁止在 else 前使用 return
    'no-else-return': ['error', {
      allowElseIf: false
    }],

    // 禁止在条件语句中赋值
    'no-cond-assign': ['error', 'always'],

    // 禁止使用 == 和 !=，强制使用 === 和 !==
    'eqeqeq': ['error', 'always', {
      null: 'ignore'
    }],

    // 禁止使用 alert
    'no-alert': 'warn',

    // 禁止使用 eval
    'no-eval': 'error',

    // 禁止使用 void
    'no-void': 'error',

    // 禁止使用 with 语句
    'no-with': 'error',

    // 禁止使用多行字符串
    'no-multi-str': 'error',

    // 禁止使用 new 关键字调用没有构造函数的对象
    'no-new': 'warn',

    // 禁止使用不必要的嵌套块
    'no-lone-blocks': 'error',

    // 禁止在循环中出现 function 声明
    'no-loop-func': 'error',

    // 禁止在 return 语句中使用赋值
    'no-return-assign': ['error', 'always'],

    // 禁止使用逗号操作符
    'no-sequences': 'error',

    // 禁止使用不必要的 return await
    'no-return-await': 'error',

    // 对象字面量空格规则交由 Prettier 处理，ESLint 不检查
    'key-spacing': 'off',

    // 关键字空格规则交由 Prettier 处理，ESLint 不检查
    'keyword-spacing': 'off',

    // 注释空格规则交由 Prettier 处理，ESLint 不检查
    'spaced-comment': 'off',

    // 操作符空格规则交由 Prettier 处理，ESLint 不检查
    'space-infix-ops': 'off',

    // 圆括号内空格规则交由 Prettier 处理，ESLint 不检查
    'space-in-parens': 'off',

    // 对象字面量空格规则交由 Prettier 处理，ESLint 不检查
    'object-curly-spacing': 'off',

    // 数组空格规则交由 Prettier 处理，ESLint 不检查
    'array-bracket-spacing': 'off',

    // 箭头函数空格规则交由 Prettier 处理，ESLint 不检查
    'arrow-spacing': 'off',

    // 尾随逗号规则交由 Prettier 处理，ESLint 不检查
    'comma-dangle': 'off',

    // 多余分号规则交由 Prettier 处理，ESLint 不检查
    'no-extra-semi': 'off',

    // 禁止在 import 语句中重复模块导出
    'no-duplicate-imports': 'error',

    // 强制在模块中使用 import/export
    'no-unresolved': 'off',

    // ==================== Vue 特定规则 ====================

    // 禁止在 data 中出现重复的键
    'vue/no-dupe-keys': 'error',

    // 禁止在模板中出现重复的属性
    'vue/no-duplicate-attributes': 'error',

    // 禁止解析错误
    'vue/no-parsing-error': 'error',

    // 禁止在计算属性中出现副作用
    'vue/no-side-effects-in-computed-properties': 'warn',

    // 禁止在 v-for 中使用未声明的变量
    'vue/no-unused-vars': 'warn',

    // 强制组件名称为多个单词
    'vue/component-name-in-template-casing': ['warn', 'kebab-case'],

    // 强制在 prop 定义中使用默认值
    'vue/require-default-prop': 'off',

    // 强制在 prop 定义中使用类型
    'vue/require-prop-types': 'warn',

    // 强制在 v-for 指令中使用 key
    'vue/require-v-for-key': 'warn',

    // 强制在模板中使用有效的 v-bind
    'vue/valid-v-bind': 'error',

    // 强制在模板中使用有效的 v-if
    'vue/valid-v-if': 'error',

    // 强制在模板中使用有效的 v-model
    'vue/valid-v-model': 'error',

    // 强制在模板中使用有效的 v-on
    'vue/valid-v-on': 'error',

    // 强制在模板中使用有效的 v-show
    'vue/valid-v-show': 'error',

    // 强制在模板中使用有效的 v-text
    'vue/valid-v-text': 'error',

    // 强制在模板中使用有效的 v-html
    'vue/valid-v-html': 'error',

    // 强制在模板中使用有效的 v-once
    'vue/valid-v-once': 'error',

    // 强制在模板中使用有效的 v-pre
    'vue/valid-v-pre': 'error',

    // 强制在模板中使用有效的 v-slot
    'vue/valid-v-slot': 'error',

    // 强制在模板中使用有效的 v-cloak
    'vue/valid-v-cloak': 'error',

    // 强制在组件中使用有效的 name 属性
    'vue/no-reserved-component-names': 'warn',

    // 禁止在组件中使用已废弃的 API
    'vue/no-deprecated-data-object-declaration': 'warn',

    // 禁止在组件中使用已废弃的过滤器
    'vue/no-deprecated-filter': 'warn',

    // 禁止在组件中使用已废弃的 $listeners
    'vue/no-deprecated-props-default-this': 'warn',

    // 禁止在组件中使用已废弃的 $scopedSlots
    'vue/no-deprecated-scope-attribute': 'warn',

    // 禁止在组件中使用已废弃的 v-bind:sync
    'vue/no-deprecated-v-bind-sync': 'warn',

    // 禁止在组件中使用已废弃的 v-on:.native
    'vue/no-deprecated-v-on-native-modifier': 'warn',

    // 强制在组件中使用一致的组件名称风格
    'vue/component-definition-name-casing': ['warn', 'PascalCase'],

    // 强制在组件中使用一致的 prop 定义风格
    'vue/prop-name-casing': ['warn', 'camelCase'],

    // 强制在组件中使用一致的 v-bind 风格
    'vue/v-bind-style': ['warn', 'shorthand'],

    // 强制在组件中使用一致的 v-on 风格
    'vue/v-on-style': ['warn', 'shorthand'],

    // 强制在组件中使用一致的 v-slot 风格
    'vue/v-slot-style': ['warn', 'shorthand'],

    // 强制在组件中使用一致的组件标签风格
    'vue/component-tags-order': 'off',

    // HTML 缩进规则交由 Prettier 处理，ESLint 不检查
    'vue/html-indent': 'off',

    // HTML 引号规则交由 Prettier 处理，ESLint 不检查
    'vue/html-quotes': 'off',

    // HTML 结束标签换行规则交由 Prettier 处理，ESLint 不检查
    'vue/html-closing-bracket-newline': 'off',

    // HTML 结束标签空格规则交由 Prettier 处理，ESLint 不检查
    'vue/html-closing-bracket-spacing': 'off',

    // HTML 每行最大属性数规则交由 Prettier 处理，ESLint 不检查
    'vue/max-attributes-per-line': 'off',

    // Script 缩进规则交由 Prettier 处理，ESLint 不检查
    'vue/script-indent': 'off',

    // HTML 自闭合标签规则交由 Prettier 处理，ESLint 不检查
    'vue/html-self-closing': 'off',

    // 强制在组件中使用一致的 this 别名
    'vue/this-in-template': ['warn', 'never'],

    // 强制在组件中使用一致的指令修饰符顺序
    'vue/order-in-components': ['warn', {
      order: [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError'
      ]
    }]
  }
}

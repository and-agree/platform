module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript', 'google', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        sourceType: 'module',
    },
    ignorePatterns: ['/**/*.js', '/lib/**/*', '/test/**/*'],
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        camelcase: ['error', { allow: ['sender_ip'] }],
        indent: ['error', 4],
        'max-len': ['error', { code: 180 }],
        'object-curly-spacing': ['error', 'always'],
        quotes: ['error', 'single'],
        'quote-props': ['error', 'as-needed'],
        'require-jsdoc': 0,
    },
};

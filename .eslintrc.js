module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/extensions': ['warn', 'always'],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        variables: true,
      },
    ],
    'no-console': 'off',
  },
};

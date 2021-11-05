module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['google', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'graphql'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 0,
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },
};

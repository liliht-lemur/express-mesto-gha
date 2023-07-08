module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'no-console': 'off',
  },

  parserOptions: {
    ecmaVersion: 'latest',
  },
};

module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:testcafe/recommended', 'prettier'],
  globals: { fetch: false },
  plugins: ['react', 'testcafe', 'prettier'],
  env: {
    jest: true,
  },
  rules: {
    'max-len': [2, 100, 2],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'function-paren-newline': 0,
    'import/prefer-default-export': 0,
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'no-underscore-dangle': 0,
    'class-methods-use-this': 'off',
    'arrow-parens': 'off',
    'no-param-reassign': 0,
    'no-use-before-define': [
      'error',
      { functions: false, classes: false },
    ],
    'no-restricted-syntax': 0,
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx'] },
    ],
    'react/forbid-prop-types': 0,
    'react/require-default-props': 0,
  },
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '*.{json,md,html,css,scss,yml,yaml}': [
    'prettier --write',
  ],
  '**/*.test.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
};
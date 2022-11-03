module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: '> 0.5%, ie >= 11',
        },
      },
    ],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};

const { override, removeModuleScopePlugin,disableEsLint } = require("customize-cra");

module.exports = override(
  removeModuleScopePlugin(),

  // disable eslint in webpack
  disableEsLint()
);

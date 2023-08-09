module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  plugins: ["react", "react-hooks", "import", "react-native"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
  ],
  rules: {
    // Add any additional rules or configurations here.
  },
};

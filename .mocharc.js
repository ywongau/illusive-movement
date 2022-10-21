module.exports = {
  diff: true,
  extension: ["js", "ts", "tsx", "jsx"],
  package: "./package.json",
  reporter: "spec",
  slow: 75,
  timeout: 60000,
  ui: "bdd",
  require: ["mocha/register.js"],
  "watch-files": ["src"],
  recursive: true,
};

/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "mocha",
  coverageAnalysis: "perTest",
  files: ["mocha/**/*.*", "src/**/*.js"],
  mutator: {
    excludedMutations: ["OptionalChaining"],
  },
  mutate: ["src/**/*.*", "!src/**/*.test.*"],
  mochaOptions: {
    spec: ["src/**/*.test.*"],
  },
};

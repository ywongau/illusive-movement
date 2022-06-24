require("@babel/register")({
  extensions: [".js", ".jsx"],
  presets: [
    ["@babel/preset-typescript"],
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        targets: {
          node: "16",
        },
        exclude: [
          "proposal-class-properties",
          "proposal-optional-chaining",
          "proposal-nullish-coalescing-operator",
        ],
      },
    ],
  ],
  plugins: [],
});
require("jsdom-global")("", { url: "http://localhost/", navigator: {} });
require("ignore-styles").default([".scss", ".css", ".svg", ".woff"]);

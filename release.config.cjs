/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { type: "major", release: "major" },
          { type: "minor", release: "minor" },
          { type: "patch", release: "patch" },
        ],
      },
    ],
  ],
};

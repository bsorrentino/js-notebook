/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

const base = require("../../jest.config.js");

module.exports = {
  ...base,
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/?(*.)+(spec|test).[tj]s?(x)",
  ],
};

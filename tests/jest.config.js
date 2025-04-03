// jest.config.js
export default {
  testEnvironment: "node",
  transform: {}, // Disable babel-jest
  extensionsToTreatAsEsm: [".js"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"],
  coverageDirectory: "coverage",
  testMatch: ["**/tests/**/*.test.js"]
}

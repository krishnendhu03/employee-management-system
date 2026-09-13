module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: [
    "<rootDir>/src/setupTests.js",
  ],

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  moduleFileExtensions: [
    "js",
    "jsx",
  ],

  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
};
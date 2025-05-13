/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  modulePaths: [
    "<rootDir>/src/"
  ],
  coveragePathIgnorePatterns: ['<rootDir>/tests/__extenders__'],
};
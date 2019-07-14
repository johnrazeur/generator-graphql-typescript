module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["./tests/bootstrap.ts"],
    testPathIgnorePatterns: ["build"]
};
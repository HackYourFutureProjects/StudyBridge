export default {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["./setupTests.ts"],
    transform: {
        "^.+\\.(t|j)sx?$": "babel-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.js"
    }
};

import createTestIdFilePath from "../createTestIdFilePath.js";

describe("createTestIdFilePath", () => {
  it("Adds all of the args", () => {
    expect(createTestIdFilePath("a", "b", "c")).toBe("a/b/c");
  });
});

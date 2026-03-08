/// <reference types="jest" />

describe("Simple Test Suite", () => {
  it("should pass basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle string operations", () => {
    const testString = "Hello World";
    expect(testString.toLowerCase()).toBe("hello world");
  });

  it("should work with arrays", () => {
    const testArray = [1, 2, 3];
    expect(testArray.length).toBe(3);
    expect(testArray.includes(2)).toBe(true);
  });
});

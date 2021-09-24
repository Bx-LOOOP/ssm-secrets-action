import { TEST } from "./action";

describe("environment Variable name tests", () => {
  test("substringAfterLastTests", async () => {
    expect(TEST.substringAfterLast("/secrets/123", "/")).toBe("123");
    expect(TEST.substringAfterLast("/secrets/", "/")).toBe("");
    expect(TEST.substringAfterLast("secrets", "/")).toBe("secrets");
  });

  test("envVarName tests", () => {
    expect(TEST.environmentVariableName("/secrets/abc")).toBe("ABC");
    expect(TEST.environmentVariableName("/secrets/1abc")).toBe("_1ABC"); // number not allowed as first char
    expect(TEST.environmentVariableName("/secrets/abc-xyz")).toBe("ABC_XYZ");
    expect(TEST.environmentVariableName("/secrets/abc-xyz-123")).toBe("ABC_XYZ_123");
  });
});

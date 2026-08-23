import { describe, it, expect } from "vitest";
import { mapAuthError } from "../../src/features/auth/utils/errorMapper";
describe("Error Mapper", () => {
  it("maps BL001", () => { expect(mapAuthError("BL001")).toContain("Student Not Found"); });
  it("maps unknown to default", () => { expect(mapAuthError("XYZ")).toContain("unknown error"); });
});
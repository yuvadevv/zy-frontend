import { describe, it, expect } from "vitest";
describe("Phone Validation", () => {
  it("removes non-digits", () => { expect("123-abc-45".replace(/\D/g, "")).toBe("12345"); });
});
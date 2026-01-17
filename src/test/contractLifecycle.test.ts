import { describe, it, expect } from "vitest";
import { canTransition, getNextStatus, ContractStatus } from "../types";

describe("Contract Lifecycle", () => {
  it("should allow valid status transitions", () => {
    // Test valid transitions
    expect(canTransition("CREATED", "APPROVED")).toBe(true);
    expect(canTransition("CREATED", "REVOKED")).toBe(true);
    expect(canTransition("APPROVED", "SENT")).toBe(true);
    expect(canTransition("SENT", "SIGNED")).toBe(true);
    expect(canTransition("SENT", "REVOKED")).toBe(true);
    expect(canTransition("SIGNED", "LOCKED")).toBe(true);
  });

  it("should reject invalid status transitions", () => {
    // Test invalid transitions
    expect(canTransition("CREATED", "SENT")).toBe(false);
    expect(canTransition("CREATED", "SIGNED")).toBe(false);
    expect(canTransition("CREATED", "LOCKED")).toBe(false);
    expect(canTransition("APPROVED", "SIGNED")).toBe(false);
    expect(canTransition("APPROVED", "LOCKED")).toBe(false);
    expect(canTransition("SIGNED", "REVOKED")).toBe(false);
    expect(canTransition("LOCKED", "SIGNED")).toBe(false);
    expect(canTransition("REVOKED", "SIGNED")).toBe(false);
  });

  it("should get next valid status", () => {
    expect(getNextStatus("CREATED")).toBe("APPROVED");
    expect(getNextStatus("APPROVED")).toBe("SENT");
    expect(getNextStatus("SENT")).toBe("SIGNED");
    expect(getNextStatus("SIGNED")).toBe("LOCKED");
    expect(getNextStatus("LOCKED")).toBeNull();
    expect(getNextStatus("REVOKED")).toBeNull();
  });

  it("should follow complete lifecycle sequence", () => {
    const lifecycle: ContractStatus[] = ["CREATED", "APPROVED", "SENT", "SIGNED", "LOCKED"];
    
    for (let i = 0; i < lifecycle.length - 1; i++) {
      const current = lifecycle[i];
      const next = lifecycle[i + 1];
      expect(canTransition(current, next)).toBe(true);
    }
  });

  it("should handle revocation correctly", () => {
    // Can revoke from CREATED
    expect(canTransition("CREATED", "REVOKED")).toBe(true);
    
    // Can revoke from SENT
    expect(canTransition("SENT", "REVOKED")).toBe(true);
    
    // Cannot revoke from SIGNED or LOCKED
    expect(canTransition("SIGNED", "REVOKED")).toBe(false);
    expect(canTransition("LOCKED", "REVOKED")).toBe(false);
  });
});
import { describe, expect, it } from "vitest";
import { canEditStagesOrTasks, canManageUsers, hasRole } from "./permissions";
import type { User } from "@/generated/prisma/client";

function user(role: User["role"], active = true): User {
  return {
    id: "u1",
    name: null,
    displayName: null,
    email: "a@b.c",
    emailVerified: null,
    image: null,
    passwordHash: null,
    role,
    isActive: active,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("hasRole", () => {
  it("retorna false para null", () => {
    expect(hasRole(null, "VIEWER")).toBe(false);
  });

  it("retorna false se utilizador inativo", () => {
    expect(hasRole(user("ADMIN", false), "VIEWER")).toBe(false);
  });

  it("ADMIN satisfaz EDITOR e VIEWER", () => {
    expect(hasRole(user("ADMIN"), "VIEWER")).toBe(true);
    expect(hasRole(user("ADMIN"), "EDITOR")).toBe(true);
    expect(hasRole(user("ADMIN"), "ADMIN")).toBe(true);
  });

  it("EDITOR satisfaz VIEWER mas não ADMIN", () => {
    expect(hasRole(user("EDITOR"), "VIEWER")).toBe(true);
    expect(hasRole(user("EDITOR"), "EDITOR")).toBe(true);
    expect(hasRole(user("EDITOR"), "ADMIN")).toBe(false);
  });

  it("VIEWER só satisfaz VIEWER", () => {
    expect(hasRole(user("VIEWER"), "VIEWER")).toBe(true);
    expect(hasRole(user("VIEWER"), "EDITOR")).toBe(false);
  });
});

describe("canEditStagesOrTasks", () => {
  it("permite EDITOR e ADMIN", () => {
    expect(canEditStagesOrTasks(user("EDITOR"))).toBe(true);
    expect(canEditStagesOrTasks(user("ADMIN"))).toBe(true);
  });

  it("nega VIEWER", () => {
    expect(canEditStagesOrTasks(user("VIEWER"))).toBe(false);
  });
});

describe("canManageUsers", () => {
  it("permite só ADMIN", () => {
    expect(canManageUsers(user("ADMIN"))).toBe(true);
    expect(canManageUsers(user("EDITOR"))).toBe(false);
    expect(canManageUsers(user("VIEWER"))).toBe(false);
  });
});

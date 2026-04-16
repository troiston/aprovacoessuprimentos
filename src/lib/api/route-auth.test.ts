import { describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/lib/auth/get-session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/domain/permissions", () => ({
  canEditStagesOrTasks: (user: { role: string }) => user.role === "EDITOR" || user.role === "ADMIN",
  canManageUsers: (user: { role: string }) => user.role === "ADMIN",
}));

import { requireAdminForApi, requireApiUser, requireEditorForApi } from "@/lib/api/route-auth";
import { getCurrentUser } from "@/lib/auth/get-session";
import type { User } from "@/generated/prisma/client";

const mockGetCurrentUser = vi.mocked(getCurrentUser);

function buildUser(role: User["role"]): User {
  return {
    id: "u1",
    name: "Tester",
    displayName: "Tester",
    email: "tester@example.com",
    emailVerified: null,
    image: null,
    passwordHash: null,
    role,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("route-auth guards", () => {
  it("retorna 401 quando não autenticado", async () => {
    mockGetCurrentUser.mockResolvedValueOnce(null);

    const result = await requireApiUser();
    expect(result).toBeInstanceOf(NextResponse);
    const json = await (result as NextResponse).json();
    expect(json.error).toContain("Não autenticado");
  });

  it("retorna 403 para editor-only quando viewer", async () => {
    mockGetCurrentUser.mockResolvedValueOnce(buildUser("VIEWER"));

    const result = await requireEditorForApi();
    expect(result).toBeInstanceOf(NextResponse);
    const json = await (result as NextResponse).json();
    expect(json.error).toContain("Sem permissão");
  });

  it("permite admin no guard admin", async () => {
    const admin = buildUser("ADMIN");
    mockGetCurrentUser.mockResolvedValueOnce(admin);

    const result = await requireAdminForApi();
    expect(result).toEqual(admin);
  });
});

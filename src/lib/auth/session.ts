import crypto from "node:crypto";
import { db } from "@/lib/db";
import { SESSION_MAX_AGE_DAYS } from "./constants";

export async function createSession(userId: string): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(
    Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
  );
  await db.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  });
  return sessionToken;
}

export async function deleteSessionByToken(sessionToken: string): Promise<void> {
  await db.session.deleteMany({
    where: { sessionToken },
  });
}

export async function getUserFromSessionToken(sessionToken: string) {
  const session = await db.session.findUnique({
    where: { sessionToken },
    include: {
      user: true,
    },
  });
  if (!session) {
    return null;
  }
  if (session.expires.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  if (!session.user.isActive) {
    return null;
  }
  return session.user;
}

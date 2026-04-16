const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const loginFailures = new Map<string, number[]>();

function pruneAttempts(attempts: number[], now: number): number[] {
  return attempts.filter((ts) => now - ts < WINDOW_MS);
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return headers.get('x-real-ip')?.trim() || 'unknown';
}

export function buildLoginRateLimitKey(ip: string, email: string): string {
  return `${ip}|${email.toLowerCase().trim()}`;
}

export function getLoginThrottleState(
  key: string,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const attempts = pruneAttempts(loginFailures.get(key) ?? [], now);
  if (attempts.length === 0) {
    loginFailures.delete(key);
    return { allowed: true, retryAfterSeconds: 0 };
  }
  loginFailures.set(key, attempts);

  if (attempts.length < MAX_ATTEMPTS) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const oldest = attempts[0];
  const retryAfterMs = Math.max(0, WINDOW_MS - (now - oldest));
  return {
    allowed: false,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
  };
}

export function registerLoginFailure(key: string, now = Date.now()): void {
  const attempts = pruneAttempts(loginFailures.get(key) ?? [], now);
  attempts.push(now);
  loginFailures.set(key, attempts);
}

export function clearLoginFailures(key: string): void {
  loginFailures.delete(key);
}

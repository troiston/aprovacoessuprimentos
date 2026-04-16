import { describe, expect, test } from 'vitest';
import {
  clearLoginFailures,
  getClientIp,
  getLoginThrottleState,
  registerLoginFailure,
} from './login-rate-limit';

describe('login-rate-limit', () => {
  test('bloqueia após o limite de falhas na janela', () => {
    const key = '127.0.0.1|user@example.com';
    const now = 1_000_000;

    for (let i = 0; i < 5; i++) {
      registerLoginFailure(key, now + i);
    }

    const state = getLoginThrottleState(key, now + 10);
    expect(state.allowed).toBe(false);
    expect(state.retryAfterSeconds).toBeGreaterThan(0);
  });

  test('desbloqueia após o fim da janela', () => {
    const key = '127.0.0.1|user@example.com';
    const now = 2_000_000;

    for (let i = 0; i < 5; i++) {
      registerLoginFailure(key, now + i);
    }

    const state = getLoginThrottleState(key, now + (10 * 60 * 1000) + 100);
    expect(state.allowed).toBe(true);
    expect(state.retryAfterSeconds).toBe(0);
  });

  test('limpa falhas após login bem-sucedido', () => {
    const key = '127.0.0.1|user@example.com';
    const now = 3_000_000;

    registerLoginFailure(key, now);
    clearLoginFailures(key);

    const state = getLoginThrottleState(key, now + 1);
    expect(state.allowed).toBe(true);
  });

  test('extrai ip do header x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.10, 10.0.0.1' });
    expect(getClientIp(headers)).toBe('203.0.113.10');
  });
});

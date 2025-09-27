export function decodeJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

export function getExpMs(token: string): number {
  const decoded = decodeJwt<{ exp?: number }>(token);
  return decoded?.exp ? decoded.exp * 1000 : 0;
}

export function isExpired(token: string, skewMs = 0): boolean {
  const expMs = getExpMs(token);
  return !expMs || Date.now() >= (expMs - skewMs);
}

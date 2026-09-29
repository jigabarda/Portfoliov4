/**
 * Sliding-window limiter kept in memory. On serverless hosts this is per instance,
 * so it is a first line of defence, not a guarantee.
 */
export function createRateLimiter({ limit, windowMs, now = () => Date.now() }: { limit: number; windowMs: number; now?: () => number }) {
  const hits = new Map<string, number[]>();

  return function allow(key: string): boolean {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(t);
    hits.set(key, recent);
    if (hits.size > 1000) {
      for (const [k, times] of hits) if (times.every((at) => t - at >= windowMs)) hits.delete(k);
    }
    return true;
  };
}

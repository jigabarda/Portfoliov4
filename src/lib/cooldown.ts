/**
 * Per-key cooldown kept in memory. Unlike the rate limiter, checking does not count:
 * call start() only once the action has really happened. On serverless hosts this is
 * per instance, so it is a first line of defence, not a guarantee.
 */
export function createCooldown({ ms, now = () => Date.now() }: { ms: number; now?: () => number }) {
  const startedAt = new Map<string, number>();

  return {
    /** Milliseconds until the key may act again; 0 when it is free. */
    remaining(key: string): number {
      const at = startedAt.get(key);
      if (at === undefined) return 0;
      const left = at + ms - now();
      if (left <= 0) {
        startedAt.delete(key);
        return 0;
      }
      return left;
    },
    start(key: string): void {
      const t = now();
      startedAt.set(key, t);
      if (startedAt.size > 1000) {
        for (const [k, at] of startedAt) if (t - at >= ms) startedAt.delete(k);
      }
    },
  };
}

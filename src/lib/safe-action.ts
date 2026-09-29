/**
 * Wrap an action so a rejected call (network drop, timeout, 5xx, stale deployment)
 * becomes a normal state instead of an error that would take down the page.
 */
export function withFallback<S, A>(action: (prev: S, arg: A) => Promise<S>, onError: (error: unknown) => S) {
  return async (prev: S, arg: A): Promise<S> => {
    try {
      return await action(prev, arg);
    } catch (error) {
      return onError(error);
    }
  };
}

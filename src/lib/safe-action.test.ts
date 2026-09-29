import { describe, expect, it } from "vitest";
import { withFallback } from "./safe-action";

type State = { status: string; message?: string };

describe("withFallback", () => {
  it("passes through the action's result", async () => {
    const action = async (_: State, n: number): Promise<State> => ({ status: `ok ${n}` });
    await expect(withFallback(action, () => ({ status: "error" }))({ status: "idle" }, 2)).resolves.toEqual({ status: "ok 2" });
  });

  it("turns a rejected call (e.g. network drop) into a state instead of throwing", async () => {
    const action = async (): Promise<State> => {
      throw new TypeError("Failed to fetch");
    };
    const safe = withFallback(action, () => ({ status: "error", message: "offline" }));
    await expect(safe({ status: "idle" }, 1)).resolves.toEqual({ status: "error", message: "offline" });
  });
});

import { describe, expect, it } from "vitest";
import { splitTags } from "./tags";

const six = ["a", "b", "c", "d", "e", "f"];

describe("splitTags", () => {
  it("shows the first `max` and hides the rest", () => {
    expect(splitTags(six, 4)).toEqual({ shown: ["a", "b", "c", "d"], hidden: ["e", "f"] });
  });
  it("shows everything when only one would be hidden (default minHidden = 2)", () => {
    expect(splitTags(six.slice(0, 5), 4)).toEqual({ shown: ["a", "b", "c", "d", "e"], hidden: [] });
  });
  it("allows a single hidden item when minHidden = 1 (project cards)", () => {
    expect(splitTags(six.slice(0, 5), 4, 1)).toEqual({ shown: ["a", "b", "c", "d"], hidden: ["e"] });
  });
  it("handles short lists", () => {
    expect(splitTags(["a"], 4)).toEqual({ shown: ["a"], hidden: [] });
  });
});

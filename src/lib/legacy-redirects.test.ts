import { describe, expect, it } from "vitest";
import { legacyRedirects } from "./legacy-redirects";

describe("legacyRedirects", () => {
  it("sends the old site's pages to the matching section, permanently", () => {
    expect(legacyRedirects).toEqual([
      { source: "/home", destination: "/", permanent: true },
      { source: "/projects", destination: "/#projects", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/stacks", destination: "/#stack", permanent: true },
    ]);
  });
});

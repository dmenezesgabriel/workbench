import { getElementSize } from "../../src/utils/resize";
import { describe, it, expect, vi } from "vitest";

/**
 * @vitest-environment jsdom
 */

describe("getElementSize", () => {
  it("returns the size of an HTML element", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    Object.defineProperty(element, "clientWidth", {
      writable: true,
      value: 220,
    });

    const getComputedStyle = vi.fn().mockReturnValue({
      paddingLeft: "40px",
      paddingRight: "40px",
      paddingTop: "40px",
      paddingBottom: "40px",
    });

    const windowSpy = vi
      .spyOn(global, "getComputedStyle")
      .mockImplementation(getComputedStyle);

    const size = getElementSize(element);
    expect(size).toEqual({ width: 140, height: -80 });

    windowSpy.mockRestore();
  });
});

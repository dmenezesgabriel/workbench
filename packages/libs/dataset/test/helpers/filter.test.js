import { describe, it, beforeEach, jest } from "@jest/globals";
import { Filter } from "../../src/helpers/filter.js";

describe("filter helper Filter", () => {
  let filter;
  let data;
  beforeEach(() => {
    data = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "John" },
    ];
    filter = new Filter(data);
  });

  it("should call filter", () => {
    const spy = jest.spyOn(data, "filter");
    filter.filter((row) => row.name === "John");
    expect(spy).toHaveBeenCalled();
  });

  it("should return filtered data", () => {
    const result = filter.filter((row) => row.name === "John");
    expect(result).toEqual([
      { id: 1, name: "John" },
      { id: 3, name: "John" },
    ]);
  });

  it("should return empty array if no data", () => {
    filter = new Filter([]);
    const result = filter.filter((row) => row.name === "John");
    expect(result).toEqual([]);
  });

  it("should return empty array if no condition", () => {
    const result = filter.filter(() => {});
    expect(result).toEqual([]);
  });
});

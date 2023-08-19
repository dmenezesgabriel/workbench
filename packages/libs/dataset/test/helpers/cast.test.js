import { describe, it, beforeEach, jest, expect } from "@jest/globals";
import {
  Converter,
  StringConverter,
  NumberConverter,
  BooleanConverter,
  DateConverter,
  Cast,
} from "../../src/helpers/cast.js";

describe("cast helper Converter", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should call _convert", () => {
    const converter = new Converter();
    const spy = jest.spyOn(converter, "_convert").mockReturnValue("John");

    converter.convert("John");

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("John");
    expect(spy).toHaveReturnedWith("John");
  });

  it("should throw an error when calling _convert", () => {
    const converter = new Converter();
    jest.spyOn(converter, "_convert").mockImplementation(() => {
      throw new Error("Error");
    });

    expect(() => converter.convert("John")).toThrow(Error);
  });
});

describe("cast helper StringConverter", () => {
  it("should convert to string", () => {
    const converter = new StringConverter();
    expect(converter.convert(1)).toEqual("1");
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new StringConverter();
    expect(() => converter.convert()).toThrow(Error);
  });
});

describe("cast helper NumberConverter", () => {
  it("should convert to number", () => {
    const converter = new NumberConverter();
    expect(converter.convert("1")).toEqual(1);
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new NumberConverter();
    expect(() => converter.convert()).toThrow(Error);
  });
});

describe("cast helper BooleanConverter", () => {
  it("should convert to boolean", () => {
    const converter = new BooleanConverter();
    expect(converter.convert("true")).toEqual(true);
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new BooleanConverter();
    expect(() => converter.convert()).toThrow(Error);
  });
});

describe("cast helper DateConverter", () => {
  let options;
  beforeEach(() => {
    options = {
      format: { year: "numeric", month: "long", day: "numeric" },
    };
  });

  it("should convert to date", () => {
    const converter = new DateConverter(options);
    expect(converter.convert("1979-03-22")).toEqual(new Date("1979-03-22"));
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new DateConverter(options);
    expect(() => converter.convert()).toThrow(Error);
  });
});

describe("cast helper Cast", () => {
  let data;
  beforeEach(() => {
    data = [
      { name: "John", age: "1", active: "true", birthDate: "1979-03-22" },
    ];

    jest.restoreAllMocks();
  });

  it("should convert value", () => {
    const cast = new Cast(data);
    expect(cast._convertValue(1, "string")).toEqual("1");
    expect(cast._convertValue(1, "number")).toEqual(1);
    expect(cast._convertValue(1, "boolean")).toEqual(true);
    const expectedDate = new Date("1979-03-22");
    expect(cast._convertValue("1979-03-22", "date")).toEqual(expectedDate);
  });

  it("should call _convertValue", () => {
    const cast = new Cast(data);
    const spy = jest.spyOn(cast, "_convertValue").mockReturnValue("John");

    const result = cast.asType({
      name: "string",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("John", "string");
    expect(spy).toHaveReturnedWith("John");
    expect(result[0].name).toEqual("John");
  });

  it("should cast data", () => {
    console.log("should cast data");
    const cast = new Cast(data);
    const result = cast.asType({
      name: "string",
      age: "number",
      active: "boolean",
      birthDate: "date",
    });

    expect(result[0].name).toEqual("John");
    expect(result[0].age).toEqual(1);
    expect(result[0].active).toEqual(true);
    const expectedDate = new Date("1979-03-22");
    expect(result[0].birthDate).toEqual(expectedDate);
  });

  it("should throw an error when calling cast with no arguments", () => {
    const cast = new Cast(data);
    expect(() => cast.cast()).toThrow(Error);
  });
});

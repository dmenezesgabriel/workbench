import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
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
    mock.restoreAll();
  });

  it("should call _convert", () => {
    const converter = new Converter();
    mock
      .method(Converter.prototype, "_convert")
      .mock.mockImplementation(() => "John");

    converter.convert("John");

    const calls = Converter.prototype._convert.mock.calls;
    assert.deepStrictEqual(calls[0].arguments[0], "John");
    assert.deepStrictEqual(Converter.prototype._convert.mock.callCount(), 1);
  });

  it("should throw an error when calling _convert", () => {
    const converter = new Converter();
    assert.throws(() => converter._convert(), Error);
  });
});

describe("cast helper StringConverter", () => {
  it("should convert to string", () => {
    const converter = new StringConverter();
    assert.strictEqual(converter.convert(1), "1");
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new StringConverter();
    assert.throws(() => converter.convert(), Error);
  });
});

describe("cast helper NumberConverter", () => {
  it("should convert to number", () => {
    const converter = new NumberConverter();
    assert.strictEqual(converter.convert("1"), 1);
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new NumberConverter();
    assert.throws(() => converter.convert(), Error);
  });
});

describe("cast helper BooleanConverter", () => {
  it("should convert to boolean", () => {
    const converter = new BooleanConverter();
    assert.strictEqual(converter.convert(1), true);
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new BooleanConverter();
    assert.throws(() => converter.convert(), Error);
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
    assert.strictEqual(converter.convert("1979-03-22"), "March 21, 1979");
  });

  it("should throw an error when calling convert with no arguments", () => {
    const converter = new DateConverter(options);
    assert.throws(() => converter.convert(), Error);
  });
});

describe("cast helper Cast", () => {
  let data;
  beforeEach(() => {
    data = [
      { name: "John", age: "1", active: "true", birthDate: "1979-03-22" },
    ];

    mock.restoreAll();
  });

  it("should return target type", () => {
    const cast = new Cast(data);
    assert.strictEqual(cast._getTargeType("string"), "string");
    assert.strictEqual(cast._getTargeType({ type: "string" }), "string");
  });

  it("should convert value", () => {
    const cast = new Cast(data);
    assert.strictEqual(cast._convertValue(1, "string"), "1");
    assert.strictEqual(cast._convertValue(1, "number"), 1);
    assert.strictEqual(cast._convertValue(1, "boolean"), true);
    assert.strictEqual(
      cast._convertValue("1979-03-22", {
        type: "Date",
        options: { format: { year: "numeric" } },
      }),
      "1979"
    );
  });

  it("should call _getTargeType", () => {
    console.log("should call _getTargeType");
    const cast = new Cast(data);
    mock
      .method(Cast.prototype, "_getTargeType")
      .mock.mockImplementation(() => "string");

    const result = cast.asType({
      name: "string",
    });

    const calls = Cast.prototype._getTargeType.mock.calls;
    assert.deepStrictEqual(calls[0].arguments[0], "string");
    assert.deepStrictEqual(Cast.prototype._getTargeType.mock.callCount(), 1);
    assert.deepStrictEqual(result[0].name, "John");
  });

  it("should call _convertValue", () => {
    console.log("should call _convertValue");
    const cast = new Cast(data);
    mock
      .method(Cast.prototype, "_convertValue")
      .mock.mockImplementation(() => "John");

    const result = cast.asType({
      name: "string",
    });

    const calls = Cast.prototype._convertValue.mock.calls;
    assert.deepStrictEqual(calls[0].arguments[0], "John");
    assert.deepStrictEqual(Cast.prototype._convertValue.mock.callCount(), 1);
    assert.deepStrictEqual(result[0].name, "John");
  });

  it("should cast data", () => {
    console.log("should cast data");
    const cast = new Cast(data);
    const result = cast.asType({
      name: "string",
      age: "number",
      active: "boolean",
      birthDate: { type: "Date", options: { format: { year: "numeric" } } },
    });
    assert.strictEqual(result[0].name, "John");
    assert.strictEqual(result[0].age, 1);
    assert.strictEqual(result[0].active, true);
    assert.strictEqual(result[0].birthDate, "1979");
  });

  it("should throw an error when calling cast with no arguments", () => {
    const cast = new Cast(data);
    assert.throws(() => cast.cast(), Error);
  });
});

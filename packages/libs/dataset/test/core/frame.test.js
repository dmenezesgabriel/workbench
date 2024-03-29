import { describe, it, beforeEach, expect } from "@jest/globals";
import { DataFrame } from "../../src/core/frame.js";

describe("core frame DataFrame head method", () => {
  let data;
  beforeEach(() => {
    data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Alice", age: 25, city: "London" },
      { name: "Bob", age: 35, city: "Paris" },
      { name: "Alice", age: 28, city: "San Francisco" },
      { name: "John", age: 20, city: "Berlin" },
      { name: "Ram", age: 25, city: "London" },
      { name: "Tom", age: 35, city: "Paris" },
      { name: "Yan", age: 28, city: "San Francisco" },
    ];
  });

  it("returns first 5 as default", () => {
    const df = new DataFrame(data);
    expect(df.head().toArray()).toEqual(data.slice(0, 5));
  });

  it("returns first 3 rows when receive number 3 as argument", () => {
    const df = new DataFrame(data);
    expect(df.head(3).toArray()).toEqual(data.slice(0, 3));
  });

  it("returns the entire DataFrame when receive a number greater than the number of rows", () => {
    const df = new DataFrame(data);
    expect(df.head(100).toArray()).toEqual(data);
  });

  it("returns an empty DataFrame when receive 0 as argument", () => {
    const df = new DataFrame(data);
    expect(df.head(0).toArray()).toEqual([]);
  });

  it("returns an empty DataFrame when receive a negative number as argument", () => {
    const df = new DataFrame(data);
    expect(df.head(-1).toArray()).toEqual([]);
  });

  it("throws an error if n is not an integer", () => {
    const df = new DataFrame(data);
    expect(() => {
      df.head("a");
    }).toThrow(TypeError);
  });
});

describe("core frame DataFrame tail method", () => {
  let data;
  beforeEach(() => {
    data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Alice", age: 25, city: "London" },
      { name: "Bob", age: 35, city: "Paris" },
      { name: "Alice", age: 28, city: "San Francisco" },
      { name: "John", age: 20, city: "Berlin" },
      { name: "Ram", age: 25, city: "London" },
      { name: "Tom", age: 35, city: "Paris" },
      { name: "Yan", age: 28, city: "San Francisco" },
    ];
  });

  it("returns last 5 as default", () => {
    const df = new DataFrame(data);
    expect(df.tail().toArray()).toEqual(data.slice(-5));
  });

  it("returns last 3 rows when receive number 3 as argument", () => {
    const df = new DataFrame(data);
    expect(df.tail(3).toArray()).toEqual(data.slice(-3));
  });

  it("returns the entire DataFrame when receive a number greater than the number of rows", () => {
    const df = new DataFrame(data);
    expect(df.tail(100).toArray()).toEqual(data);
  });

  it("returns an empty DataFrame when receive 0 as argument", () => {
    const df = new DataFrame(data);
    expect(df.tail(0).toArray()).toEqual([]);
  });

  it("returns an empty DataFrame when receive a negative number as argument", () => {
    const df = new DataFrame(data);
    expect(df.tail(-1).toArray()).toEqual([]);
  });

  it("throws an error if n is not an integer", () => {
    const df = new DataFrame(data);
    expect(() => {
      df.tail("a");
    }).toThrow(TypeError);
  });
});

describe("DataFrame methods", () => {
  it("should return unique values for a column", () => {
    const data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Alice", age: 25, city: "London" },
      { name: "Bob", age: 35, city: "Paris" },
      { name: "Alice", age: 28, city: "San Francisco" },
    ];

    const df = new DataFrame(data);
    expect(df.unique("name")).toEqual(["John", "Alice", "Bob"]);
  });

  it("should select columns", () => {
    const data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Alice", age: 25, city: "London" },
      { name: "Bob", age: 35, city: "Paris" },
      { name: "Alice", age: 28, city: "San Francisco" },
    ];
    const df = new DataFrame(data);
    expect(df.select("name", "age").toArray()).toEqual([
      { name: "John", age: 30 },
      { name: "Alice", age: 25 },
      { name: "Bob", age: 35 },
      { name: "Alice", age: 28 },
    ]);
  });

  it("should cast column types", () => {
    const data = [
      { columnA: "John", columnB: "25", columnC: "1990-01-01" },
      { columnA: "Alice", columnB: "30", columnC: "1985-06-12" },
      { columnA: "Bob", columnB: "40", columnC: "1979-03-22" },
    ];

    const convertObject = {
      columnA: "string",
      columnB: "number",
      columnC: "date",
    };

    const df = new DataFrame(data);
    const convertedDf = df.asType(convertObject);

    expect(convertedDf.toArray()).toEqual([
      { columnA: "John", columnB: 25, columnC: new Date("1990-01-01") },
      { columnA: "Alice", columnB: 30, columnC: new Date("1985-06-12") },
      { columnA: "Bob", columnB: 40, columnC: new Date("1979-03-22") },
    ]);
  });

  it("should rename columns", () => {
    const data = [
      { A: 1, B: 2 },
      { A: 3, B: 4 },
    ];

    const df = new DataFrame(data);
    const renamedDf = df.rename({ A: "a", B: "c" });

    expect(df.toArray()).toEqual([
      { A: 1, B: 2 },
      { A: 3, B: 4 },
    ]);
    expect(renamedDf.toArray()).toEqual([
      { a: 1, c: 2 },
      { a: 3, c: 4 },
    ]);
  });

  it("should filter rows", () => {
    let data = [
      { name: "John", age: 30, city: "New York" },
      { name: "Alice", age: 25, city: "London" },
      { name: "Bob", age: 35, city: "Paris" },
      { name: "Alice", age: 28, city: "San Francisco" },
    ];

    let df = new DataFrame(data);

    const filteredData = df.filter((row) => row.age > 25);

    expect(df.toArray()).toEqual(data);
    expect(filteredData.toArray()).toEqual([
      { name: "John", age: 30, city: "New York" },
      { name: "Bob", age: 35, city: "Paris" },
      { name: "Alice", age: 28, city: "San Francisco" },
    ]);
  });

  it("should pivot table columns", () => {
    const data = [
      { Country: "USA", Year: 2019, Sales: 1000 },
      { Country: "USA", Year: 2020, Sales: 1200 },
      { Country: "USA", Year: 2021, Sales: 1500 },
      { Country: "Canada", Year: 2019, Sales: 800 },
      { Country: "Canada", Year: 2020, Sales: 900 },
      { Country: "Canada", Year: 2021, Sales: 1100 },
    ];

    const df = new DataFrame(data);
    const pivotTable = df.pivot(["Country"], ["Year"], ["Sales"]);
    expect(pivotTable.toArray()).toEqual([
      { 2019: 1000, 2020: 1200, 2021: 1500, Country: "USA" },
      { 2019: 800, 2020: 900, 2021: 1100, Country: "Canada" },
    ]);
  });

  it("should rolling sum", () => {
    const data = [
      { Date: "2021-01-01", Category: "A", Value: 10 },
      { Date: "2021-01-02", Category: "A", Value: 20 },
      { Date: "2021-01-03", Category: "A", Value: 15 },
      { Date: "2021-01-01", Category: "B", Value: 5 },
      { Date: "2021-01-02", Category: "B", Value: 8 },
      { Date: "2021-01-03", Category: "B", Value: 12 },
      { Date: "2021-01-03", Category: "B", Value: 14 },
    ];

    const df = new DataFrame(data);
    const rolledData = df.rollingSum(["Category"], ["Date"], "Value", 2);

    expect(rolledData.toArray()).toEqual([
      { Date: "2021-01-01", Category: "A", Value: 10, Value_rollingSum: 10 },
      { Date: "2021-01-01", Category: "B", Value: 5, Value_rollingSum: 5 },
      { Date: "2021-01-02", Category: "A", Value: 20, Value_rollingSum: 20 },
      { Date: "2021-01-02", Category: "B", Value: 8, Value_rollingSum: 8 },
      { Date: "2021-01-03", Category: "A", Value: 15, Value_rollingSum: 15 },
      { Date: "2021-01-03", Category: "B", Value: 12, Value_rollingSum: 12 },
      { Date: "2021-01-03", Category: "B", Value: 14, Value_rollingSum: 26 },
    ]);
  });

  it("should merge dataframes", () => {
    const data1 = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
      { id: 3, name: "Bob" },
    ];

    const data2 = [
      { id: 1, age: 25 },
      { id: 2, age: 30, name: "Jane" },
    ];

    const df1 = new DataFrame(data1);
    const df2 = new DataFrame(data2);

    // Merge based on a single column name
    const mergedDf1 = df1.merge(df2, "id", "left");

    expect(df1.toArray()).toEqual(data1);
    expect(df2.toArray()).toEqual(data2);

    expect(mergedDf1.toArray()).toEqual([
      { id: 1, name: "John", age: 25 },
      { id: 2, name: "Jane", age: 30 },
      { id: 3, name: "Bob" },
    ]);

    // Merge based on a list of column names
    const mergedDf2 = df1.merge(df2, ["id", "name"]);

    expect(mergedDf2.toArray()).toEqual([{ id: 2, name: "Jane", age: 30 }]);
  });
});

describe("DataFrame GroupBy", () => {
  it("should group by", () => {
    const data = [
      { property1: "A", property2: "Y", property3: 10, property4: 5 },
      { property1: "A", property2: "Y", property3: 20, property4: 8 },
      { property1: "B", property2: "X", property3: 15, property4: 6 },
      { property1: "B", property2: "X", property3: 25, property4: 7 },
    ];

    const df = new DataFrame(data);
    const grouped = df.groupBy(["property1", "property2"]).agg({
      property3: "sum",
      property4: "avg",
    });

    expect(df.toArray()).toEqual(data);
    expect(grouped.toArray()).toEqual([
      { property1: "A", property2: "Y", property3: 30, property4: 6.5 },
      { property1: "B", property2: "X", property3: 40, property4: 6.5 },
    ]);
  });

  it("should group by and apply custom aggregation", () => {
    let data = [
      { category: "A", value: 10 },
      { category: "A", value: 15 },
      { category: "B", value: 20 },
      { category: "B", value: 25 },
      { category: "B", value: 30 },
      { category: "C", value: 35 },
    ];

    let df = new DataFrame(data);
    const grouped = df.groupBy(["category"]).agg({
      value: "quartile",
    });

    expect(df.toArray()).toEqual(data);

    expect(grouped.toArray()).toEqual([
      {
        category: "A",
        value: 10,
        value_q1: 11.25,
        value_q2: 12.5,
        value_q3: 13.75,
      },
      {
        category: "B",
        value: 20,
        value_q1: 22.5,
        value_q2: 25,
        value_q3: 27.5,
      },
      { category: "C", value: 35, value_q1: 35, value_q2: 35, value_q3: 35 },
    ]);
  });
});

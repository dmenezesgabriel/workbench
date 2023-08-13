import { Cast } from "./Cast.js";
import { Rolling } from "./Rolling.js";
import { Pivot } from "./Pivot.js";
import { Select } from "./Select.js";
import { Filter } from "./Filter.js";
import { Unique } from "./Unique.js";
import { Merge } from "./Merge.js";
import { Rename } from "./Rename.js";
import { aggregateData } from "../utils/mathOperations.js";

class DataFrame {
  constructor(data) {
    this._data = data;
    this.columns = Object.keys(this._data[0]);
  }

  toArray() {
    return this._data;
  }

  asType(convertObject) {
    const cast = new Cast(this._data);
    return new DataFrame(cast.asType(convertObject));
  }

  rollingSum(partitionBy, orderBy, valueColumn, windowSize) {
    const rolling = new Rolling(this._data);
    return new DataFrame(
      rolling.rollingSum(partitionBy, orderBy, valueColumn, windowSize)
    );
  }

  pivot(index, columns, values) {
    const pivot = new Pivot(this._data);
    return new DataFrame(pivot.pivot(index, columns, values));
  }

  select(...cols) {
    const select = new Select(this._data);
    return new DataFrame(select.select(...cols));
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[i];
    }
  }

  filter(condition) {
    const filter = new Filter(this._data);
    return new DataFrame(filter.filter(condition));
  }

  sort(col, ascending = true) {
    const sortedData = this._data.slice().sort((a, b) => {
      if (a[col] < b[col]) return ascending ? -1 : 1;
      if (a[col] > b[col]) return ascending ? 1 : -1;
      return 0;
    });
    return new DataFrame(sortedData);
  }

  count() {
    return this._data.length;
  }

  head(numLines = 5) {
    const linesToShow = this._data.slice(0, numLines);
    console.table(linesToShow);
    return new DataFrame(linesToShow);
  }

  tail(numLines = 5) {
    const linesToShow = this._data.slice(-numLines);
    console.table(linesToShow);
    return new DataFrame(linesToShow);
  }

  unique(property) {
    return new Unique(this._data).unique(property);
  }

  rename(columns) {
    const rename = new Rename(this._data);
    return new DataFrame(rename.rename(columns));
  }

  merge(otherDataFrame, on, how = "inner") {
    const merge = new Merge(this._data);
    return new DataFrame(merge.merge(otherDataFrame, on, how));
  }

  groupBy(properties) {
    return new DataFrameGroupBy(this._data, properties);
  }
}

class DataFrameGroupBy {
  constructor(data, properties) {
    this._data = data;
    this.properties = properties;
  }

  groupData() {
    return this._data.reduce((groups, row) => {
      const groupKey = this.properties
        .map((property) => row[property])
        .join("-");
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
      return groups;
    }, {});
  }

  agg(aggregations) {
    const groupedData = this.groupData(this._data, this.properties);
    const aggregatedData = aggregateData(groupedData, aggregations);
    return new DataFrame(aggregatedData);
  }
}

export { DataFrame };

class DataFrame {
  constructor(data) {
    this.data = data;
    this.columns = Object.keys(data[0]);
  }

  asType(convertObject) {
    const convertedData = [];
    const convertMap = {};

    for (const [key, targetType] of Object.entries(convertObject)) {
      if (targetType === "string") {
        convertMap[key] = String;
      } else if (targetType === "number") {
        convertMap[key] = Number;
      } else if (targetType === "boolean") {
        convertMap[key] = Boolean;
      } else if (targetType.type === "Date") {
        const options = targetType.options || {};
        convertMap[key] = (value) => {
          const formattedDate = new Date(value);
          if (options.format) {
            return formattedDate.toLocaleString(undefined, options.format);
          } else {
            return formattedDate;
          }
        };
      }
    }

    for (const row of this.data) {
      const convertedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (convertMap[key]) {
          convertedRow[key] = convertMap[key](value);
        } else {
          convertedRow[key] = value;
        }
      }
      convertedData.push(convertedRow);
    }

    return new DataFrame(convertedData);
  }

  groupBy(properties) {
    return new GroupedDataFrame(this.data, properties);
  }

  rollingSum(partitionBy, orderBy, valueColumn, windowSize) {
    const sortedData = this.data.slice().sort((a, b) => {
      for (let i = 0; i < orderBy.length; i++) {
        const orderProp = orderBy[i];
        if (a[orderProp] < b[orderProp]) {
          return -1;
        }
        if (a[orderProp] > b[orderProp]) {
          return 1;
        }
      }
      return 0;
    });

    const rolledData = sortedData.map((row, index) => {
      const startIdx = Math.max(0, index - windowSize + 1);
      const endIdx = index + 1;
      const partitionData = sortedData.slice(startIdx, endIdx).filter((r) => {
        for (let i = 0; i < partitionBy.length; i++) {
          const prop = partitionBy[i];
          if (r[prop] !== row[prop]) {
            return false;
          }
        }
        return true;
      });

      const sum = partitionData.reduce((acc, r) => acc + r[valueColumn], 0);
      return { ...row, [`${valueColumn}_rollingSum`]: sum };
    });

    return new DataFrame(rolledData);
  }

  pivot(index, columns, values) {
    const result = {};
    const indexValues = new Set();
    const columnValues = new Set();

    // Collect unique values for index and columns
    this.data.forEach((row) => {
      indexValues.add(row[index]);
      columnValues.add(row[columns]);
    });

    // Initialize result object
    indexValues.forEach((iv) => {
      result[iv] = {};
      columnValues.forEach((cv) => {
        result[iv][cv] = 0;
      });
    });

    // Perform aggregation
    this.data.forEach((row) => {
      const indexValue = row[index];
      const columnValue = row[columns];
      result[indexValue][columnValue] += row[values];
    });

    // Convert result to array of objects
    const pivotTable = [];
    indexValues.forEach((iv) => {
      const rowData = { [index]: iv };
      columnValues.forEach((cv) => {
        rowData[cv] = result[iv][cv];
      });
      pivotTable.push(rowData);
    });

    return pivotTable;
  }

  select(...cols) {
    const selectedData = [];
    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i];
      const selectedRow = {};
      for (let j = 0; j < cols.length; j++) {
        const col = cols[j];
        if (row.hasOwnProperty.call(col)) {
          selectedRow[col] = row[col];
        }
      }
      selectedData.push(selectedRow);
    }

    return new DataFrame(selectedData);
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.data.length; i++) {
      yield this.data[i];
    }
  }

  filter(condition) {
    const filteredData = [];
    for (const row of this) {
      if (condition(row)) {
        filteredData.push(row);
      }
    }
    return new DataFrame(filteredData);
  }

  sort(col, ascending = true) {
    const sortedData = this.data.slice().sort((a, b) => {
      if (a[col] < b[col]) return ascending ? -1 : 1;
      if (a[col] > b[col]) return ascending ? 1 : -1;
      return 0;
    });
    return new DataFrame(sortedData);
  }

  count() {
    return this.data.length;
  }

  head(numLines = 5) {
    const linesToShow = this.data.slice(0, numLines);
    console.table(linesToShow);
  }

  tail(numLines = 5) {
    const linesToShow = this.data.slice(-numLines);
    console.table(linesToShow);
  }

  unique(property) {
    const uniqueValues = new Set();
    for (let i = 0, len = this.data.length; i < len; i++) {
      const value = this.data[i][property];
      uniqueValues.add(value);
    }
    return Array.from(uniqueValues);
  }

  rename(columns) {
    const renamedData = [];
    const columnKeys = Object.keys(columns);

    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i];
      const renamedRow = {};

      for (let j = 0; j < columnKeys.length; j++) {
        const prop = columnKeys[j];

        if (Object.prototype.hasOwnProperty.call(row, prop)) {
          renamedRow[columns[prop]] = row[prop];
        }
      }

      for (let prop in row) {
        if (!Object.prototype.hasOwnProperty.call(columns, prop)) {
          renamedRow[prop] = row[prop];
        }
      }

      renamedData.push(renamedRow);
    }

    return new DataFrame(renamedData);
  }
  merge(otherDataFrame, on, how = "inner") {
    const mergedData = [];
    const selfData = this.data;
    const otherData = otherDataFrame.data;

    const mergeColumns = Array.isArray(on) ? on : [on];

    for (let i = 0; i < selfData.length; i++) {
      const selfRow = selfData[i];

      for (let j = 0; j < otherData.length; j++) {
        const otherRow = otherData[j];

        let isMatched = true;
        for (let k = 0; k < mergeColumns.length; k++) {
          const mergeColumn = mergeColumns[k];
          if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
            isMatched = false;
            break;
          }
        }

        if (isMatched) {
          const mergedRow = { ...selfRow, ...otherRow };
          mergedData.push(mergedRow);
        }
      }
    }

    if (mergedData.length === 0) {
      return new DataFrame([{}]); // Return an empty DataFrame if no matches found
    }

    if (how === "left") {
      const leftData = selfData
        .map((selfRow) => {
          let matchedOtherRows = otherData.filter((otherRow) => {
            let isMatched = true;
            for (let k = 0; k < mergeColumns.length; k++) {
              const mergeColumn = mergeColumns[k];
              if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
                isMatched = false;
                break;
              }
            }
            return isMatched;
          });
          if (matchedOtherRows.length > 0) {
            return matchedOtherRows.map((otherRow) => {
              return { ...selfRow, ...otherRow };
            });
          } else {
            return selfRow;
          }
        })
        .flat();
      return new DataFrame(leftData);
    }

    if (how === "right") {
      const rightData = otherData
        .map((otherRow) => {
          let matchedSelfRows = selfData.filter((selfRow) => {
            let isMatched = true;
            for (let k = 0; k < mergeColumns.length; k++) {
              const mergeColumn = mergeColumns[k];
              if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
                isMatched = false;
                break;
              }
            }
            return isMatched;
          });
          if (matchedSelfRows.length > 0) {
            return matchedSelfRows.map((selfRow) => {
              return { ...selfRow, ...otherRow };
            });
          } else {
            return otherRow;
          }
        })
        .flat();
      return new DataFrame(rightData);
    }

    if (how === "outer") {
      const outerData = [];
      for (let i = 0; i < selfData.length; i++) {
        const selfRow = selfData[i];
        let matchedOtherRows = otherData.filter((otherRow) => {
          let isMatched = true;
          for (let k = 0; k < mergeColumns.length; k++) {
            const mergeColumn = mergeColumns[k];
            if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
              isMatched = false;
              break;
            }
          }
          return isMatched;
        });
        if (matchedOtherRows.length > 0) {
          matchedOtherRows.forEach((otherRow) => {
            outerData.push({ ...selfRow, ...otherRow });
          });
        } else {
          outerData.push(selfRow);
        }
      }
      for (let j = 0; j < otherData.length; j++) {
        const otherRow = otherData[j];
        let matchedSelfRows = selfData.filter((selfRow) => {
          let isMatched = true;
          for (let k = 0; k < mergeColumns.length; k++) {
            const mergeColumn = mergeColumns[k];
            if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
              isMatched = false;
              break;
            }
          }
          return isMatched;
        });
        if (matchedSelfRows.length === 0) {
          outerData.push(otherRow);
        }
      }
      return new DataFrame(outerData);
    }

    return new DataFrame(mergedData);
  }
}

class GroupedDataFrame {
  constructor(data, properties) {
    this.data = data;
    this.properties = properties;
  }

  agg(aggregations) {
    const groupedData = groupData(this.data, this.properties);
    const aggregatedData = aggregateData(groupedData, aggregations);
    return new DataFrame(aggregatedData);
  }
}

// Helper function to group data based on specified properties
function groupData(data, properties) {
  return data.reduce((groups, row) => {
    const groupKey = properties.map((property) => row[property]).join("-");
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(row);
    return groups;
  }, {});
}

// Helper function to aggregate grouped data
function aggregateData(groupedData, aggregations) {
  return Object.entries(groupedData).map(([groupKey, groupData]) => {
    const aggregatedRow = { ...groupData[0] };
    Object.entries(aggregations).forEach(([property, aggregator]) => {
      if (aggregator === "sum") {
        aggregatedRow[property] = groupData.reduce(
          (sum, row) => sum + row[property],
          0
        );
      } else if (aggregator === "avg") {
        const sum = groupData.reduce((sum, row) => sum + row[property], 0);
        aggregatedRow[property] = sum / groupData.length;
      } else if (aggregator === "quartile") {
        const values = groupData
          .map((row) => row[property])
          .sort((a, b) => a - b);
        const q1 = calculateQuartile(values, 0.25);
        const q2 = calculateQuartile(values, 0.5);
        const q3 = calculateQuartile(values, 0.75);
        aggregatedRow[`${property}_q1`] = q1;
        aggregatedRow[`${property}_q2`] = q2;
        aggregatedRow[`${property}_q3`] = q3;
      }
    });
    return aggregatedRow;
  });
}

function calculateQuartile(values, percentile) {
  const index = (values.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const interpolation = index % 1;
  const lowerValue = values[lower];
  const upperValue = values[upper];
  return lowerValue + (upperValue - lowerValue) * interpolation;
}

// Examples //
// Example usage
let data = [
  { property1: "A", property2: "Y", property3: 10, property4: 5 },
  { property1: "A", property2: "Y", property3: 20, property4: 8 },
  { property1: "B", property2: "X", property3: 15, property4: 6 },
  { property1: "B", property2: "X", property3: 25, property4: 7 },
];

let df = new DataFrame(data);
let grouped = df.groupBy(["property1", "property2"]).agg({
  property3: "sum",
  property4: "avg",
});

console.log(grouped.data);

data = [
  { Date: "2021-01-01", Category: "A", Value: 10 },
  { Date: "2021-01-02", Category: "A", Value: 20 },
  { Date: "2021-01-03", Category: "A", Value: 15 },
  { Date: "2021-01-01", Category: "B", Value: 5 },
  { Date: "2021-01-02", Category: "B", Value: 8 },
  { Date: "2021-01-03", Category: "B", Value: 12 },
  { Date: "2021-01-03", Category: "B", Value: 14 },
];

df = new DataFrame(data);
const rolledData = df.rollingSum(["Category"], ["Date"], "Value", 2);
console.log(rolledData.data);

// Example usage
data = [
  { Country: "USA", Year: 2019, Sales: 1000 },
  { Country: "USA", Year: 2020, Sales: 1200 },
  { Country: "USA", Year: 2021, Sales: 1500 },
  { Country: "Canada", Year: 2019, Sales: 800 },
  { Country: "Canada", Year: 2020, Sales: 900 },
  { Country: "Canada", Year: 2021, Sales: 1100 },
];

df = new DataFrame(data);
const pivotTable = df.pivot("Country", "Year", "Sales");
console.log(pivotTable);

// Sample data
data = [
  { name: "John", age: 30, city: "New York" },
  { name: "Alice", age: 25, city: "London" },
  { name: "Bob", age: 35, city: "Paris" },
  { name: "Alice", age: 28, city: "San Francisco" },
  // ... More data
];

// Create a DataFrame instance
df = new DataFrame(data);

df.head(4); // Show first 5 rows

console.log(df.select("name", "age"));

// Get unique values for the "name" property
const uniqueNames = df.unique("name");
console.log(uniqueNames);

// Filter the data where age is greater than 25
const filteredData = df.filter((row) => row.age > 25);
console.log(filteredData.data);

data = [
  { columnA: "John", columnB: "25", columnC: "1990-01-01" },
  { columnA: "Alice", columnB: "30", columnC: "1985-06-12" },
  { columnA: "Bob", columnB: "40", columnC: "1979-03-22" },
];

const convertObject = {
  columnA: "string",
  columnB: "number",
  columnC: {
    type: "Date",
    options: { format: { year: "numeric", month: "long", day: "numeric" } },
  },
};

df = new DataFrame(data);
const convertedDf = df.asType(convertObject);

console.log(convertedDf.data);

// Example usage
data = [
  { A: 1, B: 2 },
  { A: 3, B: 4 },
  // ... large object array
];

df = new DataFrame(data);
const renamedDf = df.rename({ A: "a", B: "c" });

console.log(df.data);
console.log(renamedDf.data);

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
console.log(mergedDf1.data);

// Merge based on a list of column names
const mergedDf2 = df1.merge(df2, ["id", "name"]);
console.log(mergedDf2.data);

data = [
  { category: "A", value: 10 },
  { category: "A", value: 15 },
  { category: "B", value: 20 },
  { category: "B", value: 25 },
  { category: "B", value: 30 },
  { category: "C", value: 35 },
];

df = new DataFrame(data);
grouped = df.groupBy(["category"]).agg({
  value: "quartile",
});

console.log(grouped.data);

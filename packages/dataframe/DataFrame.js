class DataFrame {
  constructor(data) {
    this.data = data;
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
        aggregatedRow[property] = groupData.reduce((sum, row) => sum + row[property], 0);
      } else if (aggregator === "avg") {
        const sum = groupData.reduce((sum, row) => sum + row[property], 0);
        aggregatedRow[property] = sum / groupData.length;
      }
    });
    return aggregatedRow;
  });
}

// Example usage
let data = [
  { property1: "A", property2: "Y", property3: 10, property4: 5 },
  { property1: "A", property2: "Y", property3: 20, property4: 8 },
  { property1: "B", property2: "X", property3: 15, property4: 6 },
  { property1: "B", property2: "X", property3: 25, property4: 7 },
];

let df = new DataFrame(data);
const grouped = df.groupBy(["property1", "property2"]).agg({
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

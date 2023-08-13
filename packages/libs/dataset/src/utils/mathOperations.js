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

export { aggregateData, calculateQuartile };

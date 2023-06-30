function emitDataPoints(event) {
  const activePoints = this.chart.getElementsAtEventForMode(
    event,
    "point",
    { intersect: true },
    false
  );

  if (activePoints.length > 0) {
    const clickedPoint = activePoints[0];
    const datasetIndex = clickedPoint.datasetIndex;
    const index = clickedPoint.index;
    const datasetLabel = this.chart.data.labels[index];
    const dataValue = this.chart.data.datasets[datasetIndex].data[index];

    const dataPointEvent = new CustomEvent("dataPointClicked", {
      detail: {
        label: datasetLabel,
        value: dataValue,
      },
    });

    this.dispatchEvent(dataPointEvent);
  }
}

export { emitDataPoints };

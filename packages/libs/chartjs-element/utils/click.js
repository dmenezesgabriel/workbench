function emitDataPoints(event) {
  const elements = this.chart.getElementsAtEventForMode(
    event,
    "nearest",
    { intersect: true },
    true
  );
  if (elements.length > 0 && this.chart) {
    const datasetIndex = elements[0].datasetIndex;
    const index = elements[0].index;
    const label = JSON.parse(this.getAttribute("data")).labels[index];
    const data = JSON.parse(this.getAttribute("data")).datasets[datasetIndex]
      .data[index];
    const dataPoint = { label, data };
    console.log(dataPoint);
    this.dispatchEvent(
      new CustomEvent("chart-click", {
        detail: dataPoint,
      })
    );
  }
}

export { emitDataPoints };

/**
 * @typedef {import("../chart").HTMLChartJSElement} HTMLChartJSElement
 */

/**
 * Emits a custom event with the label and value of a clicked data point.
 * @this {HTMLChartJSElement} - The context of the function, expected to be an HTMLElement.
 * @param {MouseEvent} event - The click event.
 * @param {MouseEvent} event - The click event.
 * @returns {void}
 */
function emitDataPoints(event) {
  const activePoints = this.chart?.getElementsAtEventForMode(
    event,
    "point",
    { intersect: true },
    false
  );

  if (activePoints && activePoints.length > 0) {
    const clickedPoint = activePoints[0];
    const datasetIndex = clickedPoint?.datasetIndex;
    const index = clickedPoint?.index;
    const datasetLabel = this.chart?.data.labels?.[index];
    const dataValue = this.chart?.data.datasets?.[datasetIndex]?.data?.[index];

    if (datasetLabel !== undefined && dataValue !== undefined) {
      const dataPointEvent = new CustomEvent("dataPointClicked", {
        detail: {
          label: datasetLabel,
          value: dataValue,
        },
      });

      this.dispatchEvent(dataPointEvent);
    }
  }
}

export { emitDataPoints };

const dispatchDataPointClickPlugin = {
  id: "customClickPlugin",
  afterInit: function (chart) {
    chart.canvas.addEventListener("click", function (event) {
      if (chart.canvas) {
        const activePoints = chart.getElementsAtEventForMode(
          event,
          "point",
          { intersect: true },
          false
        );

        if (activePoints.length > 0) {
          const clickedPoint = activePoints[0];
          const datasetIndex = clickedPoint.datasetIndex;
          const index = clickedPoint.index;
          const datasetLabel = chart.data.labels[index];
          const dataValue = chart.data.datasets[datasetIndex].data[index];

          const dataPointEvent = new CustomEvent("dataPointClicked", {
            detail: {
              label: datasetLabel,
              value: dataValue,
            },
          });

          chart.canvas.dispatchEvent(dataPointEvent);
        }
      }
    });
  },
};

export { dispatchDataPointClickPlugin };

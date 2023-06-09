import "../src/assets/css/style.css";
import "./chart";

const data = JSON.stringify({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      lineTension: 0.1,
    },
  ],
});

const options = JSON.stringify({
  maintainAspectRatio: false,
  layout: { padding: 5 },
  plugins: {
    datalabels: { display: true, anchor: "end" },
    customClickPlugin: {},
  },
});

const template = document.createElement("template");
template.innerHTML = `
  <div class="chart-container">
    <chart-js
      type="line"
    ></chart-js>
  </div>
`;

/**
 * @type {*}
 */
const cloneNode = template.content.cloneNode(true);
const chart = cloneNode.querySelector("chart-js");
chart.setAttribute("data", data);
chart.setAttribute("options", options);

/**
 * @param {CustomEvent} event - The click event.
 */
function handleDataPointClicked(event) {
  const label = event.detail.label;
  const value = event.detail.value;
  console.log("Clicked Data Point:", label, value);
}

chart.addEventListener("dataPointClicked", handleDataPointClicked);

document.querySelector("#app")?.appendChild(cloneNode);

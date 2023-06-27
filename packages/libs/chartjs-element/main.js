import "./style.css";
import "./ChartJSElement";

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
  plugins: { datalabels: { display: true, anchor: "end" } },
});

const template = document.createElement("template");
template.innerHTML = `
  <div class="chart-container">
    <chart-js
      data='{"labels":["January","February","March","April","May","June","July"],"datasets":[{"label":"My First Dataset","data":[65,59,80,81,56,55,40],"fill":false,"borderColor":"rgb(75, 192, 192)","lineTension":0.1}]}'
      options='{"maintainAspectRatio": false}'
      type="line"
    ></chart-js>
  </div>
`;

template.content.querySelector("chart-js").setAttribute("data", data);
template.content.querySelector("chart-js").setAttribute("options", options);

document.querySelector("#app").appendChild(template.content.cloneNode(true));

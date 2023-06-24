import "./style.css";
import "./ChartJSElement";

const template = document.createElement("template");
template.innerHTML = `
  <chart-js
    data='{"labels":["January","February","March","April","May","June","July"],"datasets":[{"label":"My First Dataset","data":[65,59,80,81,56,55,40],"fill":false,"borderColor":"rgb(75, 192, 192)","lineTension":0.1}]}'
    type="line"
  ></chart-js>
`;

document.querySelector("#app").appendChild(template.content.cloneNode(true));

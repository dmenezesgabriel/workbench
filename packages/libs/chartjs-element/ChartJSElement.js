import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { logDataPointPlugin } from "./plugins/customClickPlugin";
import { getElementSize } from "./utils/resize";

Chart.register([ChartDataLabels, logDataPointPlugin]);

class HTMLChartJSElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.canvas = document.createElement("canvas");
    this.shadowRoot.appendChild(this.canvas);
    this.chart = null;
  }

  static get observedAttributes() {
    return ["data", "options", "plugins", "type"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.setCanvasSize();
    window.addEventListener("resize", this.makeChart.bind(this));

    this.render();
  }

  disconnectedCallback() {
    this.destroyChart();
  }

  setCanvasSize() {
    const parentElement = this.parentElement;
    const { width, height } = getElementSize(parentElement);
    this.canvas.width = width;
    this.canvas.height = height;
  }

  makeChart() {
    const data = JSON.parse(this.getAttribute("data"));
    const options = JSON.parse(this.getAttribute("options"));
    const plugins = JSON.parse(this.getAttribute("plugins"));
    const type = this.getAttribute("type");

    this.setCanvasSize();

    if (this.chart) {
      this.destroyChart();
    }

    this.chart = new Chart(this.canvas, {
      type,
      data,
      options,
      plugins,
    });
  }

  render() {
    this.makeChart();
  }

  destroyChart() {
    this.chart.destroy();
    this.chart = null;
  }
}
customElements.define("chart-js", HTMLChartJSElement);

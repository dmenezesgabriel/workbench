import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getElementSize } from "./utils/resize";
import { emitDataPoints } from "./utils/click";

Chart.register([ChartDataLabels]);

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
    window.addEventListener("resize", this.renderChart.bind(this));
    this.canvas.addEventListener("click", emitDataPoints.bind(this));
    this.render();
  }

  render() {
    this.renderChart();
  }

  disconnectedCallback() {
    this.destroyChart();
  }

  renderChart() {
    const { data, options, plugins, type } = this.parseAttributes();
    const parentElement = this.parentElement;
    const { width, height } = getElementSize(parentElement);

    this.canvas.width = width;
    this.canvas.height = height;

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

  destroyChart() {
    this.chart.destroy();
    this.chart = null;
  }

  parseAttributes() {
    const data = JSON.parse(this.getAttribute("data"));
    const options = JSON.parse(this.getAttribute("options"));
    const plugins = JSON.parse(this.getAttribute("plugins"));
    const type = this.getAttribute("type");
    return { data, options, plugins, type };
  }
}

customElements.define("chart-js", HTMLChartJSElement);

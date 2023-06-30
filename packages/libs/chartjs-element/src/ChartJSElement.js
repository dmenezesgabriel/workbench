import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getElementSize } from "./utils/resize";
import { emitDataPoints } from "./utils/click";

Chart.register([ChartDataLabels]);

/**
 * @typedef {import('chart.js').ChartOptions} ChartOptions
 * @typedef {import('chart.js').Plugin} ChartPlugin
 * @typedef {import('chart.js').ChartData} ChartData
 * @typedef {import('chart.js').ChartType} ChartType
 * @typedef {import('chart.js').ChartTypeRegistry} ChartTypeRegistry
 */

/**
 * @typedef {Object} ChartAttributes
 * @property {ChartData} data - A JSON string representing the chart's data.
 * @property {ChartOptions} options - A JSON string representing the chart's options.
 * @property {ChartPlugin[]} plugins - A JSON string representing the chart's plugins.
 * @property {ChartType} type - The type of chart to display.
 */

class HTMLChartJSElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.canvas = document.createElement("canvas");
    this.shadowRoot?.appendChild(this.canvas);
    this.chart = null;
  }

  /**
   * @returns {string[]} - An array of attribute names to observe for changes.
   */
  static get observedAttributes() {
    return ["data", "options", "plugins", "type"];
  }

  /**
   * Called when an observed attribute has been added, removed, updated, or replaced.
   * @param {string} name - The name of the attribute that was changed.
   * @param {string} oldValue - The previous value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
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
    /** @type {ChartAttributes} */
    const { data, options, plugins, type } = this.parseAttributes();
    const parentElement = this.parentElement;
    const { width, height } = getElementSize(parentElement);

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.chart) {
      this.destroyChart();
    }

    /** @type {Chart | null} */
    this.chart = new Chart(this.canvas, {
      type,
      data,
      options,
      plugins,
    });
  }

  destroyChart() {
    this.chart?.destroy();
    this.chart = null;
  }

  /**
   * Parses the chart's attributes and returns them as an object.
   * @returns {ChartAttributes} - An object containing the chart's attributes.
   */
  parseAttributes() {
    const data = JSON.parse(this.getAttribute("data") || "{}");
    const options = JSON.parse(this.getAttribute("options") || "{}");
    const plugins = JSON.parse(this.getAttribute("plugins") || "[]");
    const type = /** @type {keyof ChartTypeRegistry} */ (
      this.getAttribute("type") || "bar"
    );
    return { data, options, plugins, type };
  }
}

customElements.define("chart-js", HTMLChartJSElement);

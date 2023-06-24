import Chart from "chart.js/auto";
import { getElementSize } from "./utils/resize";
import { emitDataPoints } from "./utils/click";

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

  render() {
    const data = JSON.parse(this.getAttribute("data"));
    const options = JSON.parse(this.getAttribute("options"));
    const plugins = JSON.parse(this.getAttribute("plugins"));
    const type = this.getAttribute("type");

    if (this.chart) {
      this.destroyChart();
    }

    this.setCanvasSize();

    this.chart = new Chart(this.canvas, {
      type,
      data,
      options,
      plugins,
    });

    if (this.canvas) {
      this.canvas.onclick = emitDataPoints.bind(this);
    }
  }

  destroyChart() {
    this.chart.destroy();
    this.chart = null;
  }
}
customElements.define("chart-js", HTMLChartJSElement);

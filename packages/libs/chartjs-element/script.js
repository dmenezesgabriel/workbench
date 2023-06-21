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

  render() {
    const data = JSON.parse(this.getAttribute("data"));
    const options = JSON.parse(this.getAttribute("options"));
    const plugins = JSON.parse(this.getAttribute("plugins"));
    const type = this.getAttribute("type");

    if (this.chart) {
      this.destroyChart();
    }

    this.chart = new Chart(this.canvas, {
      type,
      data,
      options,
      plugins,
    });

    if (this.canvas) {
      this.canvas.onclick = (event) => {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
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
          const data = JSON.parse(this.getAttribute("data")).datasets[
            datasetIndex
          ].data[index];
          const dataPoint = { label, data };
          console.log(dataPoint);
          this.dispatchEvent(
            new CustomEvent("chart-click", {
              detail: dataPoint,
            })
          );
        }
      };
    }
  }

  destroyChart() {
    this.chart.destroy();
    this.chart = null;
  }
}
customElements.define("chart-js", HTMLChartJSElement);

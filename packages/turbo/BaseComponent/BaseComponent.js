class CustomComponent extends HTMLElement {
  static get observedAttributes() {
    return ["class", "styles"];
  }

  get class() {
    return this.getAttribute("class");
  }

  set class(value) {
    this.setAttribute("class", value);
    this.render();
  }

  get styles() {
    return this.getAttribute("styles");
  }

  set styles(value) {
    this.setAttribute("styles", value);
    this.render();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.render();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (["class", "styles"].includes(attrName) && this.shadowRoot) {
      this.render();
    }
  }

  render() {
    const classList = this.classList.value;
    const styles = this.styles || "";

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            ${styles}
          }
        </style>
        <div class="${classList}">
          <slot name="default-slot"></slot>
        </div>
      `;
    }
  }
}

customElements.define("custom-component", CustomComponent);

class TableData extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({ mode: "open" });

    // Define the default value property
    this.value = "";
    this.isEditing = false;
    this.originalValue = "";
    this.formatFunction = null;

    // Bind event listeners
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  static get observedAttributes() {
    return ["value", "format-function", "edition-enabled"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") {
      this.value = newValue;
      this.render();
    } else if (name === "format-function") {
      this.formatFunction = this.getFormatFunction(newValue);
      this.render();
    } else if (name === "edition-enabled") {
      this.editionEnabled = newValue === "true";
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.addEventListener("dblclick", this.handleDoubleClick);
    this.addEventListener("blur", this.handleBlur);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  removeEventListeners() {
    this.removeEventListener("dblclick", this.handleDoubleClick);
    this.removeEventListener("blur", this.handleBlur);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  getFormatFunction(formatFunctionName) {
    if (!formatFunctionName) {
      return null;
    }

    // Custom format functions can be defined here
    const formatFunctions = {
      capitalize: (value) => value.toUpperCase(),
    };

    return formatFunctions[formatFunctionName] || null;
  }

  handleDoubleClick() {
    if (!this.isEditing && this.editionEnabled) {
      this.isEditing = true;
      this.originalValue = this.value;
      this.render();
    }
  }

  handleBlur() {
    if (this.isEditing) {
      this.isEditing = false;
      if (this.originalValue !== this.value) {
        this.dispatchEvent(
          new CustomEvent("update", {
            detail: { originalValue: this.originalValue, newValue: this.value },
          })
        );
        this.render();
      }
    }
  }
  handleKeyDown(event) {
    if (this.isEditing && (event.key === "Enter" || event.key === "Tab")) {
      event.preventDefault();
      this.blur();
    }
  }

  handleInputChange(event) {
    this.value = event.target.value;
  }

  render() {
    const inputTemplate = `<input class="editable-input" type="text" value="${this.value}">`;
    const formattedValue = this.formatFunction
      ? this.formatFunction(this.value)
      : this.value;
    const content = this.isEditing ? inputTemplate : formattedValue;
    this.shadowRoot.innerHTML = `
          <td>${content}</td>
        `;
    if (this.isEditing) {
      const inputElement = this.shadowRoot.querySelector("input");
      inputElement.addEventListener("input", this.handleInputChange.bind(this));
      inputElement.focus();
    }
  }
}

// Define the custom element
customElements.define("table-data-component", TableData);

class EditableTableCell extends HTMLTableCellElement {
  constructor() {
    super();
    this.contentEditable = false;
    this.originalContent = this.textContent.trim();

    this.addEventListener("input", this.handleInput.bind(this));
  }

  static get observedAttributes() {
    return ["editable"];
  }
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName === "editable") {
      this.contentEditable = newValue !== "false";
    }
  }

  handleInput() {
    const newValue = this.textContent.trim();

    const event = new CustomEvent("cell-edited", {
      bubbles: true,
      detail: {
        oldValue: this.originalContent,
        newValue,
      },
    });

    this.dispatchEvent(event);
  }
}

customElements.define("editable-table-cell", EditableTableCell, {
  extends: "td",
});

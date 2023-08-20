class Filter {
  constructor(element) {
    this.element = element;
  }

  getSelectedOptions() {
    return Array.from(this.element.selectedOptions, (option) => option.value);
  }

  addOption(option) {
    this.element.appendChild(new Option(option, option));
  }

  clearOptions() {
    this.element.innerHTML = "";
  }
}

export { Filter };

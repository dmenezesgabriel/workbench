class Filter {
  constructor(id) {
    this.element = document.getElementById(id);
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

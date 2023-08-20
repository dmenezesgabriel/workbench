class Select {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.updateSelectStyles();
    this.createSearchInput();
    this.createDropdown();
    this.createToggle();
    this.addEventListeners();
  }

  updateSelectStyles() {
    this.selectElement.style.width = "100%";
  }

  createSearchInput() {
    this.searchContainer = document.createElement("div");
    this.searchContainer.style.display = "flex";
    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.placeholder = "Search...";
    this.searchContainer.appendChild(this.searchInput);
    this.selectElement.parentNode.insertBefore(
      this.searchContainer,
      this.selectElement
    );
  }

  createDropdown() {
    this.dropdown = document.createElement("div");
    this.dropdown.classList.add("dropdown");
    this.selectElement.style.display = "none";
    this.selectElement.parentNode.insertBefore(
      this.dropdown,
      this.selectElement
    );
    this.dropdown.appendChild(this.selectElement);
  }

  createToggle() {
    this.toggle = document.createElement("button");
    this.toggle.classList.add("toggle");
    this.toggle.innerHTML = "&#9660;";
    this.toggle.style.marginLeft = "5px";
    this.searchContainer.appendChild(this.toggle);
  }

  addEventListeners() {
    this.searchInput.addEventListener("input", () => {
      const searchValue = this.searchInput.value.toLowerCase();
      Array.from(this.selectElement.options).forEach((option) => {
        const optionText = option.textContent.toLowerCase();
        if (optionText.includes(searchValue)) {
          this.selectElement.style.display = "block";
          option.style.display = "block";
        } else {
          option.style.display = "none";
        }
      });
      if (searchValue === "") {
        this.selectElement.style.display = "none";
      }
    });

    this.toggle.addEventListener("click", (event) => {
      event.preventDefault();
      if (this.selectElement.style.display === "none") {
        console.log("open dropdown");
        this.selectElement.style.display = "block";
      } else {
        console.log("close dropdown");
        this.selectElement.style.display = "none";
      }
    });

    document.addEventListener("click", (event) => {
      if (
        !this.dropdown.contains(event.target) &&
        !this.toggle.contains(event.target)
      ) {
        this.selectElement.style.display = "none";
      }
    });
  }
}

export { Select };

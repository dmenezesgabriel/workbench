class TypewriterParagraph extends HTMLParagraphElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.style.setProperty("animation", "typewriter 1s steps(40) infinite");
    this.cursor = null;
    this.observer = null;
    this.text = "";
  }

  connectedCallback() {
    this.createCursor();
    this.observeChanges();
  }

  createCursor() {
    this.cursor = document.createElement("span");
    this.shadowRoot.appendChild(this.cursor);
  }

  observeChanges() {
    this.observer = new MutationObserver((mutations) => {
      const target = mutations[0].target;
      if (target instanceof HTMLElement && target.innerHTML !== "") {
        this.text = this.innerHTML;
        this.typingAnimation();
        this.observer.disconnect();
      }
    });

    this.observer.observe(this, { childList: true });
  }

  typingAnimation() {
    const textNode = this.shadowRoot.firstChild;
    const text = this.text;
    let characters = [];
    let currentText = "";
    let forward = true;

    const type = () => {
      if (characters.length === 0) {
        characters = text.split("");
      }

      if (forward) {
        currentText += characters.shift();
        textNode.textContent = currentText;
        if (characters.length > 0) {
          setTimeout(type, Math.floor(Math.random() * 150) + 50);
        } else {
          forward = false;
          setTimeout(type, 1000);
        }
      } else {
        currentText = currentText.slice(0, -1);
        textNode.textContent = currentText;
        if (currentText.length > 0) {
          setTimeout(type, 50);
        } else {
          forward = true;
          setTimeout(type, 1000);
        }
      }
    };

    type();
  }
}

customElements.define("typewriter-paragraph", TypewriterParagraph, {
  extends: "p",
});

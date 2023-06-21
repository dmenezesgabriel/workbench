class ResizableIframe {
  constructor(iframe) {
    this.iframe = iframe;
    this.resize();
    this.addListeners();
  }

  resize() {
    let height =
      this.iframe.contentWindow.document.body.scrollHeight + 100 + "px";
    this.iframe.style.height = height;
  }

  addListeners() {
    this.iframe.addEventListener("load", () => {
      this.resize();
      this.iframe.contentWindow.addEventListener("resize", () => {
        this.resize();
      });
    });
  }
}

let iframeElements = document.querySelectorAll("iframe");
Array.from(iframeElements).forEach((element) => {
  new ResizableIframe(element);
});

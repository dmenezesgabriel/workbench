document.getElementById("bundle-button").addEventListener("click", async () => {
  const code = document.getElementById("code-input").value;

  const bundle = await rollup.rollup({
    input: "input.js",
    plugins: [
      {
        name: "inline-js",
        resolveId(id) {
          if (id === "input.js") {
            return id;
          }
        },
        load(id) {
          if (id === "input.js") {
            return code;
          }
        },
      },
    ],
  });

  const { output } = await bundle.generate({ format: "iife", name: "bundle" });
  const bundledCode = output[0].code;

  const iframe = document.getElementById("preview-frame");
  const iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(`<script>${bundledCode}</script>`);
  iframeDocument.close();
});

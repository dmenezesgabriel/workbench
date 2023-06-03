class ConsoleToolkit {
  constructor() {}

  log(message, options = {}) {
    const { color, backgroundColor, fontWeight, showDate } = options;
    const styles = [];

    if (color) {
      styles.push(`color: ${color}`);
    }

    if (backgroundColor) {
      styles.push(`background-color: ${backgroundColor}`);
    }

    if (fontWeight) {
      styles.push(`font-weight: ${fontWeight}`);
    }

    const logMessage = showDate
      ? `[${new Date().toLocaleString()}] ${message}`
      : message;

    console.log(`%c${logMessage}`, styles.join(";"));
  }

  error(message, options = {}) {
    options.color = "red";
    this.log(`Error: ${message}`, options);
  }

  success(message, options = {}) {
    options.color = "green";
    this.log(`Success: ${message}`, options);
  }

  warning(message, options = {}) {
    options.color = "orange";
    this.log(`Warning: ${message}`, options);
  }

  info(message, options = {}) {
    options.color = "blue";
    this.log(`Info: ${message}`, options);
  }

  custom(message, styles = "") {
    console.log(`%c${message}`, styles);
  }
}

// Usage example:
const consoleToolkit = new ConsoleToolkit();

consoleToolkit.log("Hello, world!", { color: "green", showDate: true });
consoleToolkit.error("Something went wrong!", {
  fontWeight: "bold",
  showDate: true,
});
consoleToolkit.success("Operation successful!", { showDate: true });
consoleToolkit.warning("Please proceed with caution.", { showDate: true });
consoleToolkit.info("Here is some important information.", { showDate: true });

// Custom styling example:
consoleToolkit.custom(
  "Custom message",
  "color: purple; background-color: yellow"
);

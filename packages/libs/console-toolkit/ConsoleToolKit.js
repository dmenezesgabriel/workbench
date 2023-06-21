class ConsoleToolkit {
  constructor() {}

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  log(message, options = {}) {
    this.strategy.log(message, options);
  }

  error(message, options = {}) {
    this.strategy.error(message, options);
  }

  success(message, options = {}) {
    this.strategy.success(message, options);
  }

  warning(message, options = {}) {
    this.strategy.warning(message, options);
  }

  info(message, options = {}) {
    this.strategy.info(message, options);
  }

  custom(message, styles = "") {
    console.log(`%c${message}`, styles);
  }
}

class LogStrategy {
  constructor(options = {}) {
    this.options = options;
  }

  log(message) {
    const { color, backgroundColor, fontWeight, showDate } = this.options;
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

  error(message) {
    this.options.color = "red";
    this.log(`Error: ${message}`);
  }

  success(message) {
    this.options.color = "green";
    this.log(`Success: ${message}`);
  }

  warning(message) {
    this.options.color = "orange";
    this.log(`Warning: ${message}`);
  }

  info(message) {
    this.options.color = "blue";
    this.log(`Info: ${message}`);
  }
}

class SilentLogStrategy extends LogStrategy {
  constructor(options = {}) {
    super(options);
  }

  log() {
    // Do nothing, silent logging
  }

  error() {
    // Do nothing, silent logging
  }

  success() {
    // Do nothing, silent logging
  }

  warning() {
    // Do nothing, silent logging
  }

  info() {
    // Do nothing, silent logging
  }
}

// Usage example:
const consoleToolkit = new ConsoleToolkit();
const logStrategy = new LogStrategy({ showDate: true });
consoleToolkit.setStrategy(logStrategy);

consoleToolkit.log("Hello, world!", { color: "green" });
consoleToolkit.error("Something went wrong!", { fontWeight: "bold" });
consoleToolkit.success("Operation successful!");
consoleToolkit.warning("Please proceed with caution.");
consoleToolkit.info("Here is some important information.");

// Custom styling example:
consoleToolkit.custom(
  "Custom message",
  "color: purple; background-color: yellow"
);

consoleToolkit.setStrategy(new SilentLogStrategy());
consoleToolkit.log("Log message"); // No output
consoleToolkit.error("Error message"); // No output

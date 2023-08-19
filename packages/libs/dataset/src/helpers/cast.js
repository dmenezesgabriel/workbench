class Converter {
  convert(value) {
    throw new Error("Not implemented");
  }
}

class StringConverter extends Converter {
  convert(value) {
    return String(value);
  }
}

class NumberConverter extends Converter {
  convert(value) {
    return Number(value);
  }
}

class BooleanConverter extends Converter {
  convert(value) {
    return Boolean(value);
  }
}

class DateConverter extends Converter {
  constructor(options) {
    super();
    this.options = options;
  }

  convert(value) {
    const formattedDate = new Date(value);
    if (this.options.format) {
      return formattedDate.toLocaleString(undefined, this.options.format);
    } else {
      return formattedDate;
    }
  }
}

class Cast {
  constructor(data) {
    this._data = data;
    this._converters = {
      string: new StringConverter(),
      number: new NumberConverter(),
      boolean: new BooleanConverter(),
      Date: new DateConverter(),
    };
  }

  _getTargeType(target) {
    return typeof target === "object" ? target.type : target;
  }

  _convertValue(value, target) {
    const converters = new Map([
      ["string", () => new StringConverter().convert(value)],
      ["number", () => new NumberConverter().convert(value)],
      ["boolean", () => new BooleanConverter().convert(value)],
      ["Date", () => new DateConverter(target?.options).convert(value)],
    ]);

    const converter =
      converters.get(this._getTargeType(target)) || converters.get("default");
    return converter();
  }

  asType(convertObject) {
    return this._data.map((row) => {
      const convertedRow = {};
      for (const [key, targetType] of Object.entries(convertObject)) {
        convertedRow[key] = this._convertValue(row[key], targetType);
      }
      return convertedRow;
    });
  }
}
export { Cast };

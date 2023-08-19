/**
 * @typedef {Object} Options
 * @property {string} [format] - The format to use when converting a date to a string.
 */

/**
 * @typedef {Object} Target
 * @property {string} type - The type to convert the value to.
 * @property {Options} [options] - The options to use when converting a value to a date.
 */

/**
 * @typedef {Object} Row
 * @property {*} [key] - The key of the row.
 * @property {*} [value] - The value of the row.
 */

/**
 * @typedef {Object} ConvertObject
 * @property {Target} [key] - The key of the target.
 */

/**
 * @class
 * @classdesc A class for converting data types.
 */
class Converter {
  /**
   * @function
   * @abstract
   * @param {*} value - The value to convert.
   * @returns {*} The converted value.
   */
  convert(value) {
    throw new Error("Not implemented");
  }
}

/**
 * @class
 * @classdesc A class for converting values to strings.
 * @extends Converter
 */
class StringConverter extends Converter {
  /**
   * @function
   * @param {*} value - The value to convert.
   * @returns {string} The converted value.
   */
  convert(value) {
    return String(value);
  }
}

/**
 * @class
 * @classdesc A class for converting values to numbers.
 * @extends Converter
 */
class NumberConverter extends Converter {
  /**
   * @function
   * @param {*} value - The value to convert.
   * @returns {number} The converted value.
   */
  convert(value) {
    return Number(value);
  }
}

/**
 * @class
 * @classdesc A class for converting values to booleans.
 * @extends Converter
 */
class BooleanConverter extends Converter {
  /**
   * @function
   * @param {*} value - The value to convert.
   * @returns {boolean} The converted value.
   */
  convert(value) {
    return Boolean(value);
  }
}

/**
 * @class
 * @classdesc A class for converting values to dates.
 * @extends Converter
 */
class DateConverter extends Converter {
  /**
   * @constructor
   * @param {Options} options - The options to use when converting a value to a date.
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * @function
   * @param {*} value - The value to convert.
   * @returns {string|Date} The converted value.
   */
  convert(value) {
    const formattedDate = new Date(value);
    if (this.options.format) {
      return formattedDate.toLocaleString(undefined, this.options.format);
    } else {
      return formattedDate;
    }
  }
}

/**
 * @class
 * @classdesc A class for casting data types.
 */
class Cast {
  /**
   * @constructor
   * @param {Array<Row>} data - The data to cast.
   */
  constructor(data) {
    this._data = data;
  }

  /**
   * @function
   * @private
   * @param {Target} target - The target to convert the value to.
   * @returns {string} The type of the target.
   */
  _getTargeType(target) {
    return typeof target === "object" ? target.type : target;
  }

  /**
   * @function
   * @private
   * @param {*} value - The value to convert.
   * @param {Target} target - The target to convert the value to.
   * @returns {*} The converted value.
   */
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

  /**
   * @function
   * @param {ConvertObject} convertObject - The object to convert the data to.
   * @returns {Array<Object>} The converted data.
   */
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

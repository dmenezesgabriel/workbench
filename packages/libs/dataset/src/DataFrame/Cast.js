class Cast {
  constructor(data) {
    this._data = data;
  }

  asType(convertObject) {
    const convertedData = [];
    const convertMap = {};

    for (const [key, targetType] of Object.entries(convertObject)) {
      if (targetType === "string") {
        convertMap[key] = String;
      } else if (targetType === "number") {
        convertMap[key] = Number;
      } else if (targetType === "boolean") {
        convertMap[key] = Boolean;
      } else if (targetType.type === "Date") {
        const options = targetType.options || {};
        convertMap[key] = (value) => {
          const formattedDate = new Date(value);
          if (options.format) {
            return formattedDate.toLocaleString(undefined, options.format);
          } else {
            return formattedDate;
          }
        };
      }
    }

    for (const row of this._data) {
      const convertedRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (convertMap[key]) {
          convertedRow[key] = convertMap[key](value);
        } else {
          convertedRow[key] = value;
        }
      }
      convertedData.push(convertedRow);
    }

    return convertedData;
  }
}

export { Cast };

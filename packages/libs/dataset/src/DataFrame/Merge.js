class Merge {
  constructor(data) {
    this._data = data;
  }

  merge(otherDataFrame, on, how = "inner") {
    const mergedData = [];
    const selfData = this._data;
    const otherData = otherDataFrame.toArray();

    const mergeColumns = Array.isArray(on) ? on : [on];

    for (let i = 0; i < selfData.length; i++) {
      const selfRow = selfData[i];

      for (let j = 0; j < otherData.length; j++) {
        const otherRow = otherData[j];

        let isMatched = true;
        for (let k = 0; k < mergeColumns.length; k++) {
          const mergeColumn = mergeColumns[k];
          if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
            isMatched = false;
            break;
          }
        }

        if (isMatched) {
          const mergedRow = { ...selfRow, ...otherRow };
          mergedData.push(mergedRow);
        }
      }
    }

    if (mergedData.length === 0) {
      return [{}]; // Return an empty DataFrame if no matches found
    }

    if (how === "left") {
      const leftData = selfData
        .map((selfRow) => {
          let matchedOtherRows = otherData.filter((otherRow) => {
            let isMatched = true;
            for (let k = 0; k < mergeColumns.length; k++) {
              const mergeColumn = mergeColumns[k];
              if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
                isMatched = false;
                break;
              }
            }
            return isMatched;
          });
          if (matchedOtherRows.length > 0) {
            return matchedOtherRows.map((otherRow) => {
              return { ...selfRow, ...otherRow };
            });
          } else {
            return selfRow;
          }
        })
        .flat();
      return leftData;
    }

    if (how === "right") {
      const rightData = otherData
        .map((otherRow) => {
          let matchedSelfRows = selfData.filter((selfRow) => {
            let isMatched = true;
            for (let k = 0; k < mergeColumns.length; k++) {
              const mergeColumn = mergeColumns[k];
              if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
                isMatched = false;
                break;
              }
            }
            return isMatched;
          });
          if (matchedSelfRows.length > 0) {
            return matchedSelfRows.map((selfRow) => {
              return { ...selfRow, ...otherRow };
            });
          } else {
            return otherRow;
          }
        })
        .flat();
      return rightData;
    }

    if (how === "outer") {
      const outerData = [];
      for (let i = 0; i < selfData.length; i++) {
        const selfRow = selfData[i];
        let matchedOtherRows = otherData.filter((otherRow) => {
          let isMatched = true;
          for (let k = 0; k < mergeColumns.length; k++) {
            const mergeColumn = mergeColumns[k];
            if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
              isMatched = false;
              break;
            }
          }
          return isMatched;
        });
        if (matchedOtherRows.length > 0) {
          matchedOtherRows.forEach((otherRow) => {
            outerData.push({ ...selfRow, ...otherRow });
          });
        } else {
          outerData.push(selfRow);
        }
      }
      for (let j = 0; j < otherData.length; j++) {
        const otherRow = otherData[j];
        let matchedSelfRows = selfData.filter((selfRow) => {
          let isMatched = true;
          for (let k = 0; k < mergeColumns.length; k++) {
            const mergeColumn = mergeColumns[k];
            if (selfRow[mergeColumn] !== otherRow[mergeColumn]) {
              isMatched = false;
              break;
            }
          }
          return isMatched;
        });
        if (matchedSelfRows.length === 0) {
          outerData.push(otherRow);
        }
      }
      return outerData;
    }

    return mergedData;
  }
}

export { Merge };

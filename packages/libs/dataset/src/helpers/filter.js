/**
 * @template T
 */
class Filter {
  /**
   * @param {T[]} data
   */
  constructor(data) {
    this._data = data;
  }
  /**
   * @template T
   * @param {(row: T) => boolean} condition
   * @returns {T[]}
   */
  filter(condition) {
    return this._data.filter((row) => condition(row));
  }
}

export { Filter };

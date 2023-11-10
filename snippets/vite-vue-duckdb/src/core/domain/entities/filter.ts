class Filter {
  constructor(
    public readonly field: string,
    public readonly values: Array<{ name: string }>,
    public readonly tables: string[]
  ) {
    this.field = field
    this.values = values
    this.tables = tables
  }
}

export { Filter }

interface IRepository {
  query(query: string): Promise<any>
}

export type { IRepository }

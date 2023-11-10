interface IQueryService {
  loadQuery(queryPath: string): Promise<any>
  executeQuery(query: string): Promise<any>
}

export type { IQueryService }

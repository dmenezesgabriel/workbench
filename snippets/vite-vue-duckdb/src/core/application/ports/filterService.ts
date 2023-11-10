import type { IQueryService } from './queryService'

interface IFilterService {
  queryService: IQueryService
  getLastModifiedByTableName(tableName: string): Promise<any>
  getFiltersByTableName(tableName: string): Promise<any>
  getActiveFiltersByTableName(tableName: string): Promise<any>
}

export type { IFilterService }

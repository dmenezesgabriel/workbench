import type { IRepository } from '../ports/repository'
import type { IQueryService } from '../ports/queryService'

class QueryService implements IQueryService {
  private _repository: IRepository

  constructor(repository: IRepository) {
    this._repository = repository
  }

  public async loadQuery(queryPath: string): Promise<any> {
    // TODO: implement
  }

  public async executeQuery(query: string): Promise<any> {
    return await this._repository.query(query)
  }
}

export { QueryService }

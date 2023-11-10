import * as duckdb from '@duckdb/duckdb-wasm'
import type { IRepository } from '../../../../../core/application/ports/repository'

class Repository implements IRepository {
  private _db: any

  constructor(db: any) {
    this._db = db
  }

  public async query(query: string): Promise<any> {
    const conn = await this._db.connect()

    const result = await conn?.query(query)
    await conn?.close()

    return result?.toArray().map((row: any) => row.toJSON())
  }
}

export { Repository }

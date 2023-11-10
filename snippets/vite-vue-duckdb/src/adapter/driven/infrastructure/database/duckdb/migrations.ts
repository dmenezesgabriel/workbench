import { QueryService } from '../../../../../core/application/services/queryService'
import { Repository } from '../../database/duckdb/repository'

export async function createSuperStoreTable(db: any) {
  const repository = new Repository(db)
  const queryService = new QueryService(repository)
  await queryService.executeQuery(
    `
    CREATE TABLE IF NOT EXISTS superstore AS
    SELECT * FROM "http://localhost:5173/superstore.parquet"
    `
  )
}

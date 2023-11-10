import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as duckdb from '@duckdb/duckdb-wasm'
import { DatabaseManager } from '../../database/duckdb/db'
import { QueryService } from '../../../../../core/application/services/queryService'
import { Repository } from '../../database/duckdb/repository'

export const useQueryStore = defineStore('query', () => {
  const databaseManager = new DatabaseManager()

  interface db {
    instance: undefined | duckdb.AsyncDuckDB
  }

  const db = ref<undefined | duckdb.AsyncDuckDB>()

  async function initDB() {
    db.value = await databaseManager.getDB()
  }

  async function loadData() {
    const repository = new Repository(db.value!)
    const queryService = new QueryService(repository)
    await queryService.executeQuery(
      `
      CREATE TABLE IF NOT EXISTS superstore AS
      SELECT * FROM "http://localhost:5173/superstore.parquet"
      `
    )
  }

  return {
    loadData,
    initDB,
    db
  }
})

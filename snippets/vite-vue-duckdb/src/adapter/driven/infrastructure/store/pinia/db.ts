import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as duckdb from '@duckdb/duckdb-wasm'
import { DatabaseManager } from '../../database/duckdb/db'
import { createSuperStoreTable } from '../../database/duckdb/migrations'

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
    await createSuperStoreTable(db.value!)
  }

  return {
    loadData,
    initDB,
    db
  }
})

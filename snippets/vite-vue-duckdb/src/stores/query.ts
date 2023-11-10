import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useDuckDB } from '../composables/db'
import { computed } from 'vue'
import { tableFromJSON } from 'apache-arrow'
import * as duckdb from '@duckdb/duckdb-wasm'

export const useQueryStore = defineStore('query', () => {
  const { getDB } = useDuckDB()

  interface db {
    instance: undefined | duckdb.AsyncDuckDB
  }

  const db = ref<undefined | duckdb.AsyncDuckDB>()

  async function doQuery(queryString: string) {
    const conn = await db.value?.connect()

    const result = await conn?.query(queryString)

    await conn?.close()

    return result?.toArray().map((row: any) => row.toJSON())
  }

  async function initDB() {
    if (db.value) {
      return
    }
    db.value = await getDB()
  }

  async function loadData() {
    const data = await fetch(
      'https://gist.githubusercontent.com/dmenezesgabriel/3863fa620831ae2a6cb46494abcbb911/raw/67a9b5aec5208f9af8b80cd5f3397b4fb9ebe03c/superstore.json'
    ).then((res) => res.json())

    const conn = await db.value?.connect()
    const arrowTable = tableFromJSON(data)
    await conn?.query('DROP TABLE IF EXISTS superstore;')
    await conn?.insertArrowTable(arrowTable, {
      name: 'superstore'
    })
    await conn?.close()
  }

  return {
    doQuery,
    loadData,
    initDB
  }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useDuckDB } from '../composables/db'
import { computed } from 'vue'

export const useQueryStore = defineStore('query', () => {
  const { getDB } = useDuckDB()

  const queryResult = ref()

  const getQueryResult = computed(() => queryResult.value)

  const doQuery = async () => {
    const db = await getDB()
    const conn = await db.connect()

    const result = await conn.query('SELECT 42 AS answer')

    await conn.close()

    queryResult.value = result.toArray().map((row) => row.toJSON())

    return result.toArray().map((row) => row.toJSON())
  }

  return {
    doQuery,
    getQueryResult
  }
})

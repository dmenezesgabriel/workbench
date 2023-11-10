<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import { computed, onMounted, ref, watch } from 'vue'
import { useQueryStore } from '../stores/query'

const queryStore = useQueryStore()
const superstoreData = ref()

const lastModifiedFilter = ref()

const stateModel = ref()
const stateOptions = ref<undefined | any[]>([])
const cityModel = ref()
const cityOptions = ref<undefined | any[]>([])

const stateSelectValues = computed(() => {
  if (!stateModel.value) return []
  return stateModel.value.map((v: any) => v.name)
})

const citySelectValues = computed(() => {
  if (!cityModel.value) return []
  return cityModel.value.map((v: any) => v.name)
})

onMounted(async () => {
  await queryStore.initDB()
  await queryStore.loadData()
  const data = await queryStore.doQuery('SELECT DISTINCT State, City FROM superstore;')
  superstoreData.value = data

  stateOptions.value = await queryStore.doQuery('SELECT DISTINCT State as name FROM superstore;')
  cityOptions.value = await queryStore.doQuery('SELECT DISTINCT City as name FROM superstore;')
})
watch(
  [() => citySelectValues.value, () => stateSelectValues.value],
  async ([cityVal, stateVal]) => {
    const queryStore = useQueryStore()

    const filters = [
      { values: cityVal, field: 'City' },
      { values: stateVal, field: 'State' }
    ]

    let dataQuery = 'SELECT State, City FROM superstore WHERE '
    let filterQuery = 'SELECT DISTINCT State, City FROM superstore'

    if (!cityVal.length && !stateVal.length) {
      const dataQuery = 'SELECT DISTINCT State, City FROM superstore'
      const data = await queryStore.doQuery(dataQuery)
      superstoreData.value = data
      return
    }

    if (!cityVal.length) {
      const filterData = await queryStore.doQuery(filterQuery)
      stateOptions.value = filterData?.map((row: any) => ({
        name: row.State
      }))
    }

    if (!stateVal.length) {
      const filterData = await queryStore.doQuery(filterQuery)
      cityOptions.value = filterData?.map((row: any) => ({
        name: row.City
      }))
    }

    const activeFilters = filters.filter((filter) => filter.values.length > 0)

    lastModifiedFilter.value = filters.find((filter) => filter.values.length > 0)

    if (activeFilters.length > 0) {
      dataQuery += activeFilters
        .map((filter) => {
          const values = filter.values.map((value: any) => `'${value}'`).join(',')
          return `${filter.field} IN (${values})`
        })
        .join(' AND ')

      filterQuery += ' WHERE '
      filterQuery += activeFilters
        .map((filter) => {
          const values = filter.values.map((value: any) => `'${value}'`).join(',')
          return `${filter.field} IN (${values})`
        })
        .join(' AND ')
    }

    const data = await queryStore.doQuery(dataQuery)

    superstoreData.value = data

    const filterData = await queryStore.doQuery(filterQuery)

    if (lastModifiedFilter.value?.field !== 'City') {
      cityOptions.value = [...new Set(data?.map((row: any) => row.City))].map((row: any) => ({
        name: row
      }))
    }

    if (lastModifiedFilter.value?.field !== 'State') {
      stateOptions.value = [...new Set(filterData?.map((row: any) => row.State))].map(
        (row: any) => ({
          name: row
        })
      )
    }
  }
)
</script>

<template>
  <div class="container">
    <aside>
      <h3>State</h3>
      <Multiselect
        v-model="stateModel"
        :options="stateOptions"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
        :preserve-search="true"
        placeholder="Pick some"
        label="name"
        track-by="name"
        :preselect-first="false"
      />
      <h3>City</h3>
      <Multiselect
        v-model="cityModel"
        :options="cityOptions"
        :multiple="true"
        :close-on-select="false"
        :clear-on-select="false"
        :preserve-search="true"
        placeholder="Pick some"
        label="name"
        track-by="name"
        :preselect-first="false"
      />
    </aside>
    <main>
      <br />
      <!--  generate a html table from superstore data -->
      <table v-if="superstoreData">
        <thead>
          <tr>
            <th v-for="(key, index) in Object.keys(superstoreData[0])" :key="index">
              {{ key }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in superstoreData" :key="index">
            <td v-for="key in Object.keys(row)" :key="key">{{ row[key] }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  font-size: 12px;
  margin-top: 2rem;
}
aside {
  width: 20%;
  font-size: 12px;
  text-align: center;
  padding: 1rem;
}
main {
  width: 80%;
  font-size: 12px;
  text-align: center;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}
table tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>

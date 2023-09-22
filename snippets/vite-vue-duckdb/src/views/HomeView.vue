<script setup lang="ts">
import Multiselect from 'vue-multiselect'
import { onMounted, ref } from 'vue'
import { useDuckDB } from '../stores/db'

const db = useDuckDB()
const queryResult = ref()

const value = ref()
const options = [
  { name: 'Vue.js', language: 'JavaScript' },
  { name: 'Rails', language: 'Ruby' },
  { name: 'Sinatra', language: 'Ruby' },
  { name: 'Laravel', language: 'PHP', $isDisabled: true },
  { name: 'Phoenix', language: 'Elixir' }
]

onMounted(async () => {
  queryResult.value = await db.query
})
</script>

<template>
  <main>
    <Multiselect
      v-model="value"
      :options="options"
      :multiple="true"
      :close-on-select="false"
      :clear-on-select="false"
      :preserve-search="true"
      placeholder="Pick some"
      label="name"
      track-by="name"
      :preselect-first="false"
    />
    {{ value }}
    <br />
    {{ queryResult }}
  </main>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

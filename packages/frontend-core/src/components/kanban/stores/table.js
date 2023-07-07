import { writable } from "svelte/store"

export const createStores = () => {
  const table = writable(null)
  const loading = writable(false)
  const loaded = writable(false)
  const error = writable(null)

  return {
    table,
    loading,
    loaded,
    error,
  }
}

export const initialise = context => {
  const { tableId, API, table, loading, loaded, error } = context
  tableId.subscribe(async $tableId => {
    loading.set(true)
    try {
      const definition = await API.fetchTableDefinition($tableId)
      table.set(definition)
      error.set(null)
    } catch (err) {
      console.log("ERROR!", err)
      error.set(err)
    }
    loading.set(false)
    loaded.set(true)
  })
}

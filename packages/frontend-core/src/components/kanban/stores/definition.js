import { writable } from "svelte/store"

export const createStores = () => {
  const loading = writable(false)
  const loaded = writable(false)
  const error = writable(null)

  return {
    loading,
    loaded,
    error,
  }
}

export const initialise = context => {
  const { datasource, loading, loaded, error } = context
  datasource.subscribe(async () => {
    loading.set(true)
    try {
      await datasource.actions.refreshDefinition()
    } catch (err) {
      console.log("ERROR", err)
      error.set(err)
    }
    loading.set(false)
    loaded.set(true)
  })
}

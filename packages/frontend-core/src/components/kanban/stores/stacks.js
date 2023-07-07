import { writable, get, derived } from "svelte/store"

export const createStores = () => {
  const stackColumn = writable(null)

  return {
    stackColumn,
  }
}

export const deriveStores = context => {
  const { stackColumn, columns } = context

  // Extract the stack values
  const stackValues = derived(
    [stackColumn, columns],
    ([$stackColumn, $columns]) => {
      if (!$stackColumn) {
        return []
      }
      const schema = $columns.find(x => x.name === $stackColumn)?.schema
      return (schema?.constraints?.inclusion || []).slice(0, 8)
    }
  )

  return {
    stackValues,
  }
}

export const initialise = context => {
  const { columns, stackColumn } = context

  // Derive the stack column and keep it valid
  columns.subscribe($columns => {
    const $stackColumn = get(stackColumn)

    // If we have no options columns, clear the stack columns
    const options = $columns.filter(x => x.schema?.type === "options")
    if (!options.length) {
      stackColumn.set(null)
      return
    }

    // If we don't have a stack column yet, use the first option.
    // Otherwise validate the chosen stack column.
    if (!$stackColumn || !$columns.some(x => x.name === $stackColumn)) {
      stackColumn.set(options[0].name)
    }
  })
}

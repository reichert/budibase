import { derived, get, writable } from "svelte/store"
import { cloneDeep } from "lodash/fp"
import { DefaultColumnWidth } from "../../grid/lib/constants"

export const createStores = () => {
  const columns = writable([])

  // Derived list of columns which have not been explicitly hidden
  const visibleColumns = derived(
    columns,
    $columns => {
      return $columns.filter(col => col.visible)
    },
    []
  )

  // Checks if we have a certain column by name
  const hasColumn = column => {
    const $columns = get(columns)
    return $columns.some(col => col.name === column)
  }

  return {
    columns: {
      ...columns,
      actions: {
        hasColumn,
      },
    },
    visibleColumns,
  }
}

export const deriveStores = context => {
  const { table, columns, API, dispatch, config } = context

  // Persists column changes by saving metadata against table schema
  const saveChanges = async () => {
    const $columns = get(columns)
    const $table = get(table)
    const newSchema = cloneDeep($table.schema)

    // Build new updated table schema
    Object.keys(newSchema).forEach(column => {
      // Respect order specified by columns
      const index = $columns.findIndex(x => x.name === column)
      if (index !== -1) {
        newSchema[column].order = index
      } else {
        delete newSchema[column].order
      }

      // Copy over metadata
      newSchema[column].visible = $columns[index]?.visible ?? true
      newSchema[column].width = $columns[index]?.width || DefaultColumnWidth
    })

    await saveTable({ ...$table, schema: newSchema })
  }

  const saveTable = async newTable => {
    // Update local state
    table.set(newTable)

    // Update server
    if (get(config).allowSchemaChanges) {
      await API.saveTable(newTable)
    }

    // Broadcast change to external state can be updated, as this change
    // will not be received by the builder websocket because we caused it ourselves
    dispatch("updatetable", newTable)
  }

  return {
    columns: {
      ...columns,
      actions: {
        ...columns.actions,
        saveChanges,
        saveTable,
      },
    },
  }
}

export const initialise = context => {
  const { table, columns, schemaOverrides } = context

  const schema = derived(
    [table, schemaOverrides],
    ([$table, $schemaOverrides]) => {
      if (!$table?.schema) {
        return null
      }
      let newSchema = { ...$table?.schema }

      // Apply schema overrides
      Object.keys($schemaOverrides || {}).forEach(field => {
        if (newSchema[field]) {
          newSchema[field] = {
            ...newSchema[field],
            ...$schemaOverrides[field],
          }
        }
      })

      return newSchema
    }
  )

  // Merge new schema fields with existing schema in order to preserve widths
  schema.subscribe($schema => {
    if (!$schema) {
      columns.set([])
      return
    }
    const $table = get(table)

    // Find primary display
    let primaryDisplay
    if ($table.primaryDisplay && $schema[$table.primaryDisplay]) {
      primaryDisplay = $table.primaryDisplay
    }

    // Get field list
    let fields = []
    Object.keys($schema).forEach(field => {
      if (field !== primaryDisplay) {
        fields.push(field)
      }
    })

    // Update columns, removing extraneous columns and adding missing ones
    columns.set(
      fields
        .map(field => ({
          name: field,
          label: $schema[field].displayName || field,
          schema: $schema[field],
          visible: $schema[field].visible ?? true,
          order: $schema[field].order,
        }))
        .sort((a, b) => {
          // Sort by order first
          const orderA = a.order
          const orderB = b.order
          if (orderA != null && orderB != null) {
            return orderA < orderB ? -1 : 1
          } else if (orderA != null) {
            return -1
          } else if (orderB != null) {
            return 1
          }

          // Then sort by auto columns
          const autoColA = a.schema?.autocolumn
          const autoColB = b.schema?.autocolumn
          if (autoColA === autoColB) {
            return 0
          }
          return autoColA ? 1 : -1
        })
    )
  })
}

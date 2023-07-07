import { writable, derived, get } from "svelte/store"
import { fetchData } from "../../../fetch/fetchData"
import { StackCardLimit } from "../lib/constants"

export const createStores = () => {
  const stackRowStores = writable([])

  const sortedRowStores = derived(stackRowStores, $stores => {
    let sorted = [...$stores]
    sorted.sort((a, b) => {
      return a.idx < b.idx ? -1 : 1
    })
    return sorted
  })

  return {
    stackRowStores: {
      ...stackRowStores,
      subscribe: sortedRowStores.subscribe,
    },
  }
}

export const deriveStores = context => {
  const { stackRowStores, stackColumn, tempInclusions } = context

  const stackRowStoreMap = derived(stackRowStores, $stackRowStores => {
    let map = {}
    $stackRowStores.forEach($store => {
      map[$store.stack] = $store
    })
    return map
  })

  const refreshStack = async stack => {
    console.log("refresh", stack)
    const store = get(stackRowStoreMap)[stack]
    await store?.fetch.refresh()
  }

  const addRow = row => {
    const $stackColumn = get(stackColumn)
    const stack = row[$stackColumn]
    tempInclusions.update(state => ({
      ...state,
      [stack]: [...(state[stack] || []), row],
    }))
  }

  return {
    rows: {
      actions: {
        refreshStack,
        addRow,
      },
    },
    stackRowStoreMap,
  }
}

export const initialise = context => {
  const {
    API,
    tableId,
    stackRowStores,
    stackRowStoreMap,
    table,
    stackColumn,
    stackValues,
  } = context

  // Ensure we have fetches for every stack
  stackValues.subscribe($stackValues => {
    const $stackRowStoreMap = get(stackRowStoreMap)
    const $table = get(table)
    const $tableId = get(tableId)
    const $stackColumn = get(stackColumn)
    if (!$table || !$stackColumn) {
      return
    }

    const stackColumnInfo = $table.schema[$stackColumn]
    $stackValues.forEach(value => {
      if (!$stackRowStoreMap[value]) {
        const fetch = fetchData({
          API,
          datasource: {
            type: "table",
            tableId: $tableId,
          },
          options: {
            query: {
              equal: {
                [`1:${$stackColumn}`]: value,
              },
            },
            sortColumn: null,
            sortOrder: "descending",
            limit: StackCardLimit,
            paginate: true,
          },
        })
        const newStore = {
          stack: value,
          idx: stackColumnInfo.constraints.inclusion.indexOf(value),
          fetch,
          id: Math.random(),
        }
        stackRowStores.update(state => [...state, newStore])
      }
    })
  })

  stackColumn.subscribe(() => {
    stackRowStores.set([])
  })
}

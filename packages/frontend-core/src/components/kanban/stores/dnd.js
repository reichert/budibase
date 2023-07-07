import { get, derived, writable } from "svelte/store"

export const createStores = () => {
  const draggedRow = writable(null)
  const dropCandidateStack = writable(null)
  const tempExclusions = writable({})
  const tempInclusions = writable({})

  return {
    draggedRow,
    dropCandidateStack,
    tempExclusions,
    tempInclusions,
  }
}

export const deriveStores = context => {
  const {
    draggedRow,
    dropCandidateStack,
    stackColumn,
    API,
    rows,
    tempExclusions,
    tempInclusions,
  } = context

  const isDragging = derived(draggedRow, $row => $row != null)

  const dragSourceStack = derived(
    [draggedRow, stackColumn],
    ([$draggedRow, $stackColumn]) => {
      if (!$draggedRow || !$stackColumn) {
        return null
      }
      return $draggedRow[$stackColumn]
    }
  )

  const drag = row => {
    draggedRow.set(row)
  }

  const consider = stack => {
    const $dropCandidateStack = get(dropCandidateStack)
    if (stack !== $dropCandidateStack) {
      dropCandidateStack.set(stack)
    }
  }

  const drop = async () => {
    const $stackColumn = get(stackColumn)
    const row = get(draggedRow)
    const sourceStack = get(dragSourceStack)
    const targetStack = get(dropCandidateStack)
    const newRow = {
      ...row,
      [$stackColumn]: targetStack,
    }

    // Update state
    draggedRow.set(null)
    dropCandidateStack.set(null)
    if (sourceStack === targetStack) {
      return
    }
    tempExclusions.update(state => ({
      ...state,
      [sourceStack]: {
        ...state[sourceStack],
        [row._id]: true,
      },
    }))
    tempInclusions.update(state => ({
      ...state,
      [targetStack]: [...(state[targetStack] || []), newRow],
    }))
    tempExclusions.set({
      [sourceStack]: {
        [row._id]: true,
      },
    })

    // Actually save and refresh rows
    await API.saveRow(newRow)
    await rows.actions.refreshStack(sourceStack)
    await rows.actions.refreshStack(targetStack)

    // Reset state
    tempExclusions.update(state => {
      delete state[sourceStack]?.[row._id]
      return state
    })
    tempInclusions.update(state => ({
      ...state,
      [targetStack]: state[targetStack].filter(x => x._id !== row._id),
    }))
  }

  return {
    dnd: {
      actions: {
        drag,
        consider,
        drop,
      },
    },
    isDragging,
    dragSourceStack,
  }
}

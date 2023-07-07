import * as Config from "./config"
import * as Table from "./table"
import * as Columns from "./columns"
import * as Stacks from "./stacks"
import * as DND from "./dnd"
import * as Rows from "./rows"

const DependencyOrderedStores = [Config, Table, Columns, Rows, Stacks, DND]

export const attachStores = context => {
  // Atomic store creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.createStores?.(context) }
  }

  // Derived store creation
  for (let store of DependencyOrderedStores) {
    context = { ...context, ...store.deriveStores?.(context) }
  }

  // Initialise any store logic
  for (let store of DependencyOrderedStores) {
    store.initialise?.(context)
  }

  return context
}

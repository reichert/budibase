<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Toggle, Icon } from "@budibase/bbui"
  import { getColumnIcon } from "../lib/utils"

  const { columns, stackColumn } = getContext("kanban")

  let open = false
  let anchor

  const toggleVisibility = (column, visible) => {
    columns.update(state => {
      const index = state.findIndex(col => col.name === column.name)
      state[index].visible = visible
      return state.slice()
    })
    columns.actions.saveChanges()
  }

  const showAll = () => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        visible: true,
      }))
    })
    columns.actions.saveChanges()
  }

  const hideAll = () => {
    columns.update(state => {
      return state.map(col => ({
        ...col,
        visible: false,
      }))
    })
    columns.actions.saveChanges()
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="Settings"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
    disabled={!$columns.length || !$stackColumn}
  >
    Customise cards
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <div class="columns">
      {#each $columns as column}
        <div class="column">
          <Icon size="S" name={getColumnIcon(column)} />
          {column.label}
        </div>
        <Toggle
          size="S"
          value={column.visible}
          on:change={e => toggleVisibility(column, e.detail)}
        />
      {/each}
    </div>
    <div class="buttons">
      <ActionButton on:click={showAll}>Show all</ActionButton>
      <ActionButton on:click={hideAll}>Hide all</ActionButton>
    </div>
  </div>
</Popover>

<style>
  .content {
    padding: 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
  .columns {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
  }
  .columns :global(.spectrum-Switch) {
    margin-right: 0;
  }
  .column {
    display: flex;
    gap: 8px;
  }
</style>

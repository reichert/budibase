<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Select } from "@budibase/bbui"

  const { columns, stackColumn } = getContext("kanban")

  let open = false
  let anchor

  $: columnOptions = getColumnOptions($columns)

  const getColumnOptions = columns => {
    return columns
      .filter(x => x.schema.type === "options" || x.schema.type === "array")
      .map(x => {
        return {
          label: x.label || x.name,
          value: x.name,
        }
      })
  }

  const updateStackColumn = e => {
    stackColumn.set(e.detail)
    open = false
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="Group"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
    disabled={!columnOptions.length}
  >
    Stacked by {$stackColumn || "nothing"}
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <Select
      placeholder={null}
      value={$stackColumn}
      options={columnOptions}
      autoWidth
      on:change={updateStackColumn}
      label="Column"
    />
  </div>
</Popover>

<style>
  .content {
    padding: 6px 12px 12px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .content :global(.spectrum-Picker) {
    width: 140px;
  }
</style>

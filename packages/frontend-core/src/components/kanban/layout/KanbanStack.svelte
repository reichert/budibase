<script>
  import { getContext } from "svelte"
  import { getColor } from "../lib/utils"
  import { ProgressCircle, Icon } from "@budibase/bbui"
  import { fade } from "svelte/transition"
  import KanbanCard from "./KanbanCard.svelte"
  import { derived } from "svelte/store"

  export let fetch
  export let stack
  export let idx

  const {
    table,
    visibleColumns,
    dispatch,
    draggedRow,
    dnd,
    dropCandidateStack,
    tempInclusions,
    tempExclusions,
    dragSourceStack,
  } = getContext("kanban")

  $: primaryDisplay = $table.primaryDisplay
  $: color = getColor(idx)
  $: exlusions = derived(
    tempExclusions,
    $tempExclusions => $tempExclusions[stack]
  )
  $: inclusions = derived(
    tempInclusions,
    $tempInclusions => $tempInclusions[stack]
  )
  $: rows = getRows($fetch.rows, $exlusions, $inclusions)

  const getRows = (allRows, exclusions, inclusions) => {
    let rows = allRows.slice()
    inclusions?.forEach(row => {
      if (!rows.some(x => x._id === row._id)) {
        rows = [row, ...rows]
      }
    })
    return rows.filter(row => !exclusions?.[row._id])
  }

  document.addEventListener("dragover", function (e) {
    e.preventDefault()
  })
</script>

<div
  class="kanban-stack"
  on:dragenter={() => {
    dnd.actions.consider(stack)
  }}
  class:considered={$dropCandidateStack === stack && stack !== $dragSourceStack}
  on:mouseup={() => {
    console.log("mouse up")
  }}
>
  <div class="title">
    <div class="badge" style="--color:{color};">
      <span>
        {stack}
      </span>
    </div>
    <Icon hoverable name="Add" on:click={() => dispatch("add-row", stack)} />
  </div>

  {#if !$fetch.loaded}
    <div transition:fade|local={{ duration: 130 }} class="loading">
      <ProgressCircle />
    </div>
  {/if}
  {#if rows.length}
    <div class="cards">
      {#each rows as row}
        <KanbanCard
          {row}
          {primaryDisplay}
          visibleColumns={$visibleColumns}
          dragged={$draggedRow?._id === row._id}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .kanban-stack {
    flex: 0 0 280px;
    border-radius: 8px;
    background: var(--kanban-background-alt);
    padding: 12px;
    border: var(--cell-border);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
    max-height: 100%;
    overflow: hidden;
    outline: 2px solid transparent;
    transition: outline 130ms ease-out;
  }
  .kanban-stack.considered {
    outline: 2px solid var(--accent-color);
  }
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .title :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-700);
  }
  .badge {
    padding: 3px calc(var(--cell-padding) * 1.25);
    background: var(--color);
    border-radius: calc(var(--cell-padding) * 1.25);
    user-select: none;
    display: flex;
    align-items: center;
    gap: var(--cell-spacing);
    max-width: 100%;
    align-self: flex-start;
  }
  .badge span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
  }
  .loading {
    display: flex;
    justify-content: center;
  }
  .cards {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    overflow-y: auto;
    overflow-x: hidden;
    gap: 8px;
    margin: 0 -6px;
    padding: 0 6px;
  }
</style>

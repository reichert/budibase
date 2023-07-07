<script>
  import CardValue from "../renderers/CardValue.svelte"
  import { getContext } from "svelte"

  export let row
  export let primaryDisplay
  export let visibleColumns
  export let dragged = false

  const { dispatch, dnd } = getContext("kanban")
</script>

<div
  class="card"
  on:click={() => dispatch("edit-row", row)}
  class:dragged
  on:dragstart={() => {
    dnd.actions.drag(row)
  }}
  draggable="true"
  on:dragend={dnd.actions.drop}
>
  <h1>
    {row[primaryDisplay]}
  </h1>
  {#each visibleColumns as column}
    <CardValue {column} {row} />
  {/each}
</div>

<style>
  .card {
    border-radius: 8px;
    background: var(--kanban-background);
    padding: 12px;
    border: var(--cell-border);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 14px;
    border-width: 2px;
    transition: border-color 130ms ease-out;
    user-select: none;
  }
  .card:hover {
    border-color: var(--spectrum-global-color-gray-400);
  }
  .card:hover,
  .card:hover :global(*) {
    cursor: grab;
  }
  .card.dragged {
    opacity: 0.5;
  }
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 400;
  }
</style>

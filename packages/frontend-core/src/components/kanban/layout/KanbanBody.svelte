<script>
  import { getContext } from "svelte"
  import KanbanStack from "./KanbanStack.svelte"

  const { stackRowStores } = getContext("kanban")
</script>

<div class="kanban-body">
  {#each $stackRowStores as { fetch, stack, idx, id } (id)}
    <KanbanStack {fetch} {stack} {idx} />
  {/each}
</div>

<style>
  .kanban-body {
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 16px;
    gap: 12px;
  }
</style>

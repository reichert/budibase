<script>
  import { setContext } from "svelte"
  import { fade } from "svelte/transition"
  import { ProgressCircle } from "@budibase/bbui"
  import { createAPIClient } from "../../../api"
  import { attachStores } from "../stores"
  import KanbanBody from "./KanbanBody.svelte"
  import StackedByButton from "../controls/StackedByButton.svelte"
  import CustomiseCardsButton from "../controls/CustomiseCardsButton.svelte"
  import { createEventManagers } from "../lib/events"

  export let API = null
  export let tableId = null
  export let schemaOverrides = null
  export let allowAddRows = true
  export let allowExpandRows = true
  export let allowEditRows = true
  export let allowDeleteRows = true
  export let allowSchemaChanges = true
  export let notifySuccess = null
  export let notifyError = null

  // Unique identifier for DOM nodes inside this instance
  const rand = Math.random()

  // Build up context
  let context = {
    API: API || createAPIClient(),
    rand,
    props: $$props,
  }
  context = { ...context, ...createEventManagers() }
  context = attachStores(context)

  // Reference some stores for local use
  const { config, loaded, loading, error, stackColumn } = context

  // Keep config store up to date with props
  $: config.set({
    tableId,
    schemaOverrides,
    allowAddRows,
    allowExpandRows,
    allowEditRows,
    allowDeleteRows,
    allowSchemaChanges,
    notifySuccess,
    notifyError,
  })

  // Set context for children to consume
  setContext("kanban", context)
</script>

<div class="kanban" id="kanban-{rand}">
  <div class="controls">
    <div class="controls-left">
      <StackedByButton />
      <CustomiseCardsButton />
      <slot name="controls" />
    </div>
    <div class="controls-right" />
  </div>
  {#if $loaded}
    {#if $stackColumn}
      <div class="kanban-data">
        <KanbanBody />
        <div class="overlays" />
      </div>
    {:else}
      <div class="kanban-error">
        <div class="kanban-error-title">
          Add an options column to enable the Kanban view
        </div>
      </div>
    {/if}
  {:else if $error}
    <div class="kanban-error">
      <div class="kanban-error-title">
        There was a problem loading your kanban board
      </div>
      <div class="kanban-error-subtitle">
        {$error}
      </div>
    </div>
  {/if}
  {#if $loading && !$error}
    <div in:fade|local={{ duration: 130 }} class="kanban-loading">
      <ProgressCircle />
    </div>
  {/if}
</div>

<style>
  /* Core kanban */
  .kanban {
    /* Variables */
    --accent-color: var(--primaryColor, var(--spectrum-global-color-blue-400));
    --kanban-background: var(--spectrum-global-color-gray-50);
    --kanban-background-alt: var(--spectrum-global-color-gray-100);
    --cell-background: var(--kanban-background);
    --cell-background-hover: var(--kanban-background-alt);
    --cell-background-alt: var(--cell-background);
    --cell-padding: 8px;
    --cell-spacing: 4px;
    --cell-border: 1px solid var(--spectrum-global-color-gray-200);
    --cell-font-size: 14px;
    --controls-height: 50px;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    overflow: hidden;
    background: var(--kanban-background);
  }
  .kanban,
  .kanban :global(*) {
    box-sizing: border-box;
  }

  /* Data layers */
  .kanban-data {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: stretch;
    overflow: hidden;
    height: 0;
  }

  /* Controls */
  .controls {
    height: var(--controls-height);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
    padding: var(--cell-padding);
    gap: var(--cell-spacing);
    background: var(--kanban-background-alt);
    z-index: 2;
  }
  .controls-left,
  .controls-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--cell-spacing);
  }
  .controls-right {
    gap: 12px;
  }

  /* Overlays */
  .overlays {
    z-index: 10;
  }

  /* Loading */
  .kanban-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: 100;
  }
  .kanban-loading:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--kanban-background-alt);
    opacity: 0.6;
  }

  /* Error */
  .kanban-error {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  .kanban-error-title {
    font-size: 18px;
    font-weight: 600;
  }
  .kanban-error-subtitle {
    font-size: 16px;
  }
</style>

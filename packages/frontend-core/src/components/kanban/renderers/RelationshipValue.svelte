<script>
  import { getColor } from "../lib/utils"

  export let value

  const readable = value => {
    if (value == null) {
      return ""
    }
    if (value instanceof Object) {
      return JSON.stringify(value)
    }
    return value
  }
</script>

<div class="values">
  {#each value || [] as relationship}
    {#if relationship.primaryDisplay}
      <div class="badge" style="--color:{getColor(0)};">
        <span>
          {readable(relationship.primaryDisplay)}
        </span>
      </div>
    {/if}
  {/each}
</div>

<style>
  .values {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .badge {
    flex: 0 0 auto;
    padding: 0 var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
    display: flex;
    align-items: center;
    gap: var(--cell-spacing);
    height: 20px;
    max-width: 100%;
  }
  .badge span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>

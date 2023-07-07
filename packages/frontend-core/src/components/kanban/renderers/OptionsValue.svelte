<script>
  import { getColor } from "../lib/utils"

  export let value
  export let schema
</script>

<div
  class="badge"
  style="--color:{getColor(schema.constraints.inclusion.indexOf(value))};"
>
  <span>{value}</span>
</div>

<style>
  .badge {
    padding: 0 var(--cell-padding);
    background: var(--color);
    border-radius: var(--cell-padding);
    user-select: none;
    display: flex;
    align-items: center;
    gap: var(--cell-spacing);
    height: 20px;
    max-width: 100%;
    align-self: flex-start;
  }
  .badge span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>

<script>
  import OptionsValue from "./OptionsValue.svelte"

  export let value
  export let schema
</script>

<div class="values">
  {#if Array.isArray(value)}
    {#each value as val}
      <OptionsValue value={val} {schema} />
    {/each}
  {:else}
    <OptionsValue {value} {schema} />
  {/if}
</div>

<style>
  .values {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
</style>

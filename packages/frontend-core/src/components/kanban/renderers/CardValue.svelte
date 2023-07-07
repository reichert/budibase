<script context="module">
  import TextValue from "./TextValue.svelte"
  import OptionsValue from "./OptionsValue.svelte"
  import DateValue from "./DateValue.svelte"
  import MultiSelectValue from "./MultiSelectValue.svelte"
  import RelationshipValue from "./RelationshipValue.svelte"

  const ComponentValueMap = {
    text: TextValue,
    options: OptionsValue,
    datetime: DateValue,
    array: MultiSelectValue,
    link: RelationshipValue,
  }
</script>

<script>
  import { getColumnIcon } from "../lib/utils"
  import { Icon } from "@budibase/bbui"

  export let column
  export let row

  $: value = row?.[column.name]
  $: component = ComponentValueMap[column.schema.type] || TextValue

  const isEmptyValue = value => {
    if (value == null || value === "") {
      return true
    }
    if (Array.isArray(value) && !value.length) {
      return true
    }
    return false
  }
</script>

{#if !isEmptyValue(value)}
  <div class="card-value">
    <div class="label">
      <Icon name={getColumnIcon(column)} size="S" />
      {column.label}
    </div>
    <svelte:component this={component} schema={column.schema} {value} />
  </div>
{/if}

<style>
  .card-value {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .label {
    display: flex;
    flex-direction: row;
    color: var(--spectrum-global-color-gray-500);
    margin-bottom: 4px;
    gap: 4px;
    font-size: 13px;
  }
  .label :global(.spectrum-Icon) {
    width: 14px;
  }
</style>

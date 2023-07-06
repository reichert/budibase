<script>
  import ObjectField from "./fields/Object.svelte"
  import BooleanField from "./fields/Boolean.svelte"
  import LongFormField from "./fields/LongForm.svelte"
  import FieldGroupField from "./fields/FieldGroup.svelte"
  import StringField from "./fields/String.svelte"
  import SelectField from "./fields/Select.svelte"
  import GoogleSheetsSelector from "./fields/GoogleSheetsSelector.svelte"

  export let type
  export let value
  export let error
  export let name
  export let options
  export let integration
  export let showModal = () => {}

  const selectComponent = type => {
    if (type === "object") {
      return ObjectField
    } else if (type === "boolean") {
      return BooleanField
    } else if (type === "longForm") {
      return LongFormField
    } else if (type === "fieldGroup") {
      return FieldGroupField
    } else if (type === "select") {
      return SelectField
    } else if (name === "Spreadsheet URL") {
      return GoogleSheetsSelector
    } else {
      return StringField
    }
  }

  $: component = selectComponent(type)
</script>

<svelte:component
  this={component}
  {type}
  {value}
  {error}
  {name}
  {options}
  {showModal}
  {integration}
  on:blur
  on:change
/>

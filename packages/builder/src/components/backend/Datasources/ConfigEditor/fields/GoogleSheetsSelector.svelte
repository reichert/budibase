<script>
  import { Input, Label, clickOutside } from "@budibase/bbui"
  import { API } from "api"
  import { params } from "@roxi/routify"
  import { createEventDispatcher } from "svelte"

  export let integration
  export let type
  export let name
  export let value
  export let error

  let dispatch = createEventDispatcher()

  let showResults = false
  let search = ''
  let options = []

  const onOptionSelect = (newValue) => {
    dispatch("change", newValue)
  }

  const query = (googleId, query) => {
    console.log(googleId, query)
    API.fetchGoogleSheets({ googleId, query })
      .then(r => {
        options = r.data.files
      })
      .catch(e => console.log(e))
  }

  $: googleId = $params["?continue_google_setup"]
  $: query(googleId, search)
</script>

<div class="form-row">
  <Label>Spreadsheet</Label>
    <div class="inputContainer" use:clickOutside={() => showResults = false}>
    {#if value != null}
      <div class="selectedValue">
        <div>
          {value}
        </div>
        <button on:click={() => onOptionSelect(null)}>
          ×
        </button>
      </div>
    {:else}
      <Input
        {type}
        bind:value={search}
        on:focus={() => showResults = true}
      />
      <div class="options">
        {#if showResults && options.length > 0}
          {#each options as option}
            <div
              class="option clickable"
              value={option.id}
              on:click={() => onOptionSelect(option.id)}
            >
              <div>
                {option.name}
              </div>
              <a target="_blank" href={option.webViewLink}>
                Preview
              </a>
            </div>
          {/each}
        {:else if showResults}
          <div
            class="option"
          >
          No results for "{search}"
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .inputContainer {
    position: relative;
    z-index: 2;
  }

  .selectedValue {
    padding: 5px 10px;
    background-color: var(--background-alt);
    display: flex;
  }

  .selectedValue button {
    margin-left: auto;
    background-color: transparent;
    color: var(--gray-7);
    border: none;
    font-size: 20px;
  }

  .selectedValue button:hover {
    color: var(--grey-9);
    cursor: pointer;
  }

  .options {
    position: absolute;
    width: 100%;
    background-color: var(--background-alt);
    overflow-y: scroll;
  }

  .option {
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
    display: flex;
  }

  .option a {
    margin-left: auto;
  }

  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    background-color: var(--grey-3);
  }
</style>

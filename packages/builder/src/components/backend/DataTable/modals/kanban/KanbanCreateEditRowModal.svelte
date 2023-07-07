<script>
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext, onMount } from "svelte"
  import { Modal, notifications } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"

  const { subscribe, stackColumn, rows } = getContext("kanban")

  let modal
  let row

  const deleteRow = () => {
    notifications.success("Deleted 1 row")
  }

  onMount(() =>
    subscribe("add-row", value => {
      row = {
        [$stackColumn]: value,
      }
      modal.show()
    })
  )
  onMount(() =>
    subscribe("edit-row", rowToEdit => {
      row = cloneDeep(rowToEdit)
      modal.show()
    })
  )
</script>

<Modal bind:this={modal}>
  <CreateEditRow
    {row}
    on:deleteRows={deleteRow}
    on:updaterows={e => rows.actions.addRow(e.detail)}
  />
</Modal>

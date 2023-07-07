<script>
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext, onMount } from "svelte"
  import { Modal, notifications } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"

  const { subscribe, stackColumn, rows, API } = getContext("kanban")

  let modal
  let row

  const updateRow = e => {
    rows.actions.refreshStack(e.detail[$stackColumn])
  }

  const deleteRow = async () => {
    await API.deleteRow({
      rowId: row._id,
      revId: row._rev,
      tableId: row.tableId,
    })
    notifications.success("Deleted 1 row")
    await rows.actions.refreshStack(row[$stackColumn])
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
  <CreateEditRow {row} on:deleterow={deleteRow} on:updaterow={updateRow} />
</Modal>

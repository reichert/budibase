<script>
  import { datasources, tables } from "stores/backend"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import { TableNames } from "constants"
  import { Grid, Kanban } from "@budibase/frontend-core"
  import { API } from "api"
  import GridAddColumnModal from "components/backend/DataTable/modals/grid/GridCreateColumnModal.svelte"
  import GridCreateEditRowModal from "components/backend/DataTable/modals/grid/GridCreateEditRowModal.svelte"
  import GridEditUserModal from "components/backend/DataTable/modals/grid/GridEditUserModal.svelte"
  import GridCreateViewButton from "components/backend/DataTable/buttons/grid/GridCreateViewButton.svelte"
  import GridImportButton from "components/backend/DataTable/buttons/grid/GridImportButton.svelte"
  import GridExportButton from "components/backend/DataTable/buttons/grid/GridExportButton.svelte"
  import GridFilterButton from "components/backend/DataTable/buttons/grid/GridFilterButton.svelte"
  import GridManageAccessButton from "components/backend/DataTable/buttons/grid/GridManageAccessButton.svelte"
  import GridRelationshipButton from "components/backend/DataTable/buttons/grid/GridRelationshipButton.svelte"
  import GridEditColumnModal from "components/backend/DataTable/modals/grid/GridEditColumnModal.svelte"
  import { Tabs, Tab } from "@budibase/bbui"
  import KanbanCreateEditRowModal from "components/backend/DataTable/modals/kanban/KanbanCreateEditRowModal.svelte"

  const userSchemaOverrides = {
    firstName: { displayName: "First name", disabled: true },
    lastName: { displayName: "Last name", disabled: true },
    email: { displayName: "Email", disabled: true },
    roleId: { displayName: "Role", disabled: true },
    status: { displayName: "Status", disabled: true },
  }

  $: id = $tables.selected?._id
  $: isUsersTable = id === TableNames.USERS
  $: isInternal = $tables.selected?.type !== "external"

  const handleGridTableUpdate = async e => {
    tables.replaceTable(id, e.detail)

    // We need to refresh datasources when an external table changes.
    // Type "external" may exist - sometimes type is "table" and sometimes it
    // is "external" - it has different meanings in different endpoints.
    // If we check both these then we hopefully catch all external tables.
    if (e.detail?.type === "external" || e.detail?.sql) {
      await datasources.fetch()
    }
  }
</script>

<div class="wrapper">
  <Tabs selected="Grid">
    <Tab icon="Table" title="Grid">
      <div class="tab-content">
        <Grid
          {API}
          tableId={id}
          allowAddRows={!isUsersTable}
          allowDeleteRows={!isUsersTable}
          schemaOverrides={isUsersTable ? userSchemaOverrides : null}
          showAvatars={false}
          on:updatetable={handleGridTableUpdate}
        >
          <svelte:fragment slot="filter">
            <GridFilterButton />
          </svelte:fragment>
          <svelte:fragment slot="controls">
            {#if isInternal}
              <GridCreateViewButton />
            {/if}
            <GridManageAccessButton />
            {#if !isInternal}
              <GridRelationshipButton />
            {/if}
            {#if isUsersTable}
              <EditRolesButton />
            {:else}
              <GridImportButton />
            {/if}
            <GridExportButton />
            <GridAddColumnModal />
            <GridEditColumnModal />
            {#if isUsersTable}
              <GridEditUserModal />
            {:else}
              <GridCreateEditRowModal />
            {/if}
          </svelte:fragment>
        </Grid>
      </div>
    </Tab>
    <Tab icon="ViewColumn" title="Kanban">
      <div class="tab-content">
        <Kanban
          {API}
          tableId={id}
          allowAddRows={!isUsersTable}
          allowDeleteRows={!isUsersTable}
          schemaOverrides={isUsersTable ? userSchemaOverrides : null}
          showAvatars={false}
          on:updatetable={handleGridTableUpdate}
        >
          <svelte:fragment slot="controls">
            <KanbanCreateEditRowModal />
          </svelte:fragment>
        </Kanban>
      </div>
    </Tab>
  </Tabs>
</div>

<style>
  .wrapper {
    flex: 1 1 auto;
    margin: -28px -40px -40px -40px;
    display: flex;
    flex-direction: column;
    background: var(--background);
    overflow: hidden;
  }
  .wrapper :global(.spectrum-Tabs-content) {
    margin: 0;
    flex: 1 1 auto;
    position: relative;
  }
  .tab-content {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>

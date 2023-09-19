import * as Config from "../../grid/stores/config"
import * as Datasource from "../../grid/stores/datasource"
import * as Columns from "../../grid/stores/columns"
import * as Table from "../../grid/stores/table"
import * as ViewV2 from "../../grid/stores/viewV2"
import * as Notifications from "../../grid/stores/notifications"
import * as Sort from "../../grid/stores/sort"
import * as Filter from "../../grid/stores/filter"
import * as Bounds from "../../grid/stores/bounds"

// Custom kanban stores
import * as Stacks from "./stacks"
import * as DND from "./dnd"
import * as Rows from "./rows"
import * as Definition from "./definition"

export const DependencyOrderedStores = [
  Sort,
  Filter,
  Bounds,
  Table,
  ViewV2,
  Datasource,
  Columns,
  Rows,
  Config,
  Definition,
  Notifications,
  Stacks,
  DND,
]

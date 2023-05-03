import {
  DatasourceFieldType,
  Integration,
  QueryType,
  CustomDatasourcePlus,
  SearchParams,
} from "@budibase/types"
import { Firestore, WhereFilterOp } from "@google-cloud/firestore"

interface FirebaseConfig {
  email: string
  privateKey: string
  projectId: string
}

const SCHEMA: Integration = {
  docs: "https://firebase.google.com/docs/firestore/quickstart",
  friendlyName: "Firestore",
  type: "Non-relational",
  customPlus: true,
  relationships: false,
  description:
    "Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud.",
  datasource: {
    email: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    privateKey: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
    projectId: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
  },
  query: {
    create: {
      type: QueryType.JSON,
    },
    read: {
      type: QueryType.JSON,
    },
    update: {
      type: QueryType.JSON,
    },
    delete: {
      type: QueryType.JSON,
    },
  },
  extra: {
    collection: {
      displayName: "Collection",
      type: DatasourceFieldType.STRING,
      required: true,
    },
    filterField: {
      displayName: "Filter field",
      type: DatasourceFieldType.STRING,
      required: false,
    },
    filter: {
      displayName: "Filter comparison",
      type: DatasourceFieldType.LIST,
      required: false,
      data: {
        read: [
          "==",
          "<",
          "<=",
          "!=",
          ">=",
          ">",
          "array-contains",
          "in",
          "not-in",
          "array-contains-any",
        ],
      },
    },
    filterValue: {
      displayName: "Filter value",
      type: DatasourceFieldType.STRING,
      required: false,
    },
  },
}

class FirebaseIntegration implements CustomDatasourcePlus {
  private config: FirebaseConfig
  private client: Firestore

  constructor(config: FirebaseConfig) {
    this.config = config
    this.client = new Firestore({
      projectId: config.projectId,
      credentials: {
        client_email: config.email,
        private_key: config.privateKey?.replace(/\\n/g, "\n"),
      },
    })
  }

  async create(query: { json: object; extra: { [key: string]: string } }) {
    try {
      const documentReference = this.client
        .collection(query.extra.collection)
        .doc()
      await documentReference.set({ ...query.json, id: documentReference.id })
      const snapshot = await documentReference.get()
      return snapshot.data()
    } catch (err) {
      console.error("Error writing to Firestore", err)
      throw err
    }
  }

  async search(originalQuery: any, params: SearchParams): Promise<any> {
    let filterField, filter, filterValue
    if (Object.keys(params.filters?.equal || {}).length > 0) {
      filterField = Object.keys(params.filters!.equal!)[0]
      filter = "=="
      filterValue = params.filters!.equal![filterField]
    }
    originalQuery.extra["pagination"] = params.pagination
    if (filter && filterField) {
      return await this.read({
        json: originalQuery.json,
        extra: {
          filterField,
          filter,
          filterValue,
          ...originalQuery.extra,
        },
      })
    }
    return await this.read(originalQuery)
  }

  async read(query: { json: object; extra: { [key: string]: any } }) {
    try {
      let sortOrder = query.extra?.pagination?.sort?.order
        ?.toLowerCase()
        .replace("ending", "")
      let sortColumn = query.extra?.pagination?.sort?.column
      const collectionRef = this.client.collection(query.extra.collection)
      let snapshot
      if (
        query.extra.filterField &&
        query.extra.filter &&
        query.extra.filterValue
      ) {
        snapshot = collectionRef.where(
          query.extra.filterField,
          query.extra.filter as WhereFilterOp,
          query.extra.filterValue
        )
      }
      if (sortColumn && sortOrder) {
        snapshot = snapshot ?? collectionRef
        snapshot = snapshot
          .orderBy(sortColumn, sortOrder)
          .limit(query.extra?.pagination?.limit)
      }
      snapshot = snapshot ?? collectionRef
      snapshot = await snapshot.get()
      const result: any[] = []
      snapshot.forEach(doc => result.push(doc.data()))

      return result
    } catch (err) {
      console.error("Error querying Firestore", err)
      throw err
    }
  }

  async update(query: {
    json: Record<string, any>
    extra: { [key: string]: string }
  }) {
    try {
      await this.client
        .collection(query.extra.collection)
        .doc(query.json.id)
        .update(query.json)

      return (
        await this.client
          .collection(query.extra.collection)
          .doc(query.json.id)
          .get()
      ).data()
    } catch (err) {
      console.error("Error writing to Firestore", err)
      throw err
    }
  }

  async delete(query: {
    json: { id: string }
    extra: { [key: string]: string }
  }) {
    try {
      await this.client
        .collection(query.extra.collection)
        .doc(query.json.id)
        .delete()
      return true
    } catch (err) {
      console.error("Error deleting from Firestore", err)
      throw err
    }
  }
}

export default {
  schema: SCHEMA,
  integration: FirebaseIntegration,
}

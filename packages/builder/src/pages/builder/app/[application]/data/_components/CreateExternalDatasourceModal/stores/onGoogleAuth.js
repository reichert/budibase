import { derived } from "svelte/store"
import { params } from "@roxi/routify"
import { integrations } from "stores/backend"
import { IntegrationTypes } from "constants/backend"
import { API } from "api"

export const createOnGoogleAuthStore = () => {
  return derived([params, integrations], ([$params, $integrations]) => {
    const id = $params["?continue_google_setup"]

    return callback => {
      if ($integrations && id) {
        //API.fetchGoogleSheets({ googleId: id, query: '' }).then(r => console.log(r)).catch(e => console.log(e))
        const integration = {
          name: IntegrationTypes.GOOGLE_SHEETS,
          ...$integrations[IntegrationTypes.GOOGLE_SHEETS],
        }

        const fields = { continueSetupId: id, sheetId: "" }

        callback(integration, fields)
      }
    }
  })
}

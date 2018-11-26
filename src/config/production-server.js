if (process.env.SERVER_SOURCE_MAPS) {
  require('source-map-support').install()
}
import Server from '../server'
import { log, notify } from '../server/utilities/logger'
import appConfig from './config-proxy'

export default async function() {
  let currentApp
  try {
    currentApp = new Server({ config: appConfig })
    // Register plugins
    // Start server
    const uri = await currentApp.start()
    notify(`Server started at: ${uri}\n`)
  } catch (e) {
    log.error(e)
  }
}

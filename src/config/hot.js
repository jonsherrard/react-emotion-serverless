import { createNewServerProxy } from './hot-server'
import { notify } from '../server/utilities/logger'

let currentApp = createNewServerProxy()

if (module.hot) {
  module.hot.accept('./hot-server', async function() {
    await currentApp.stop({ timeout: 0 })
    currentApp = createNewServerProxy()
    const uri = await currentApp.start()
    notify(`🔁  HMR Reloading './hot-server' at ${uri}`)
  })
  notify(`✅  Server-side HMR Enabled`)
}

currentApp.start(null, function(err, address) {
  console.log({ address })
  notify(`Server started at: ${address}\n`)
})

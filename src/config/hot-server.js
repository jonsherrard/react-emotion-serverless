import Server from '../server'
import appConfig from './config-proxy'

const createNewServerProxy = function() {
  return new Server({ config: appConfig })
}

export { createNewServerProxy }

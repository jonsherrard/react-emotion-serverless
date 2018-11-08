import 'make-promises-safe'

import DynamicRouteHandler from './handlers/dynamic'
import CacheManager from './utilities/cache-manager'

// Create CacheManager Singleton
new CacheManager()

class Server {
  constructor({ config }) {
    // Create Hapi server instance
    // Require the framework and instantiate it
    const server = require('fastify')({
      logger: true
    })

    // Handle server routes
    DynamicRouteHandler({ config, server })
    // return server instance (not class)
    return server
  }
}

export default Server

import 'make-promises-safe'

import DynamicRouteHandler from './handlers/dynamic'

class Server {
  constructor({ config }) {
    // Create Hapi server instance
    // Require the framework and instantiate it
    const server = require('fastify')({
      logger: false
    })

    // Handle server routes
    DynamicRouteHandler({ config, server })
    // return server instance (not class)

    // Enables backwards compatibility with Hapi tests
    server.start = server.listen
    server.stop = server.close
    return server
  }
}

export default Server

import dotenv from "dotenv"

// Loading configuration from environment
dotenv.config()

import  { createLogger } from "bunyan"

import { MongoDB } from "./db/MongoDB"
import { Config } from "./config/Config"
import { App } from "./http/App"
import { Metrics } from "./metrics/Metrics"
import { SocketApp } from "./socket/SocketApp"
import { SocketSessionManagerSingleton } from "./lib/SocketSessionManagerSingleton"

const run = async () => {
    // Configuration
    const config = new Config(process.env)

    // Logger
    const logger = createLogger({
        name: config.serviceName,
        level: "debug"
    })

    // Metrics
    const metrics = new Metrics(config, logger)
    
    // Deps
    const dbClient = await new MongoDB(config, logger).connect()

    // Initiate the socket application
    const socketSessionManager = new SocketSessionManagerSingleton(logger, metrics)
    const socketApp = new SocketApp(config, logger, socketSessionManager)
    await socketApp.run()

    // Run the HTTP Application
    const app = new App(config, logger, metrics, socketSessionManager)
    await app.run()

    return { logger }
}

run().then(({logger}) => {
    logger.info("Application successfully started!")
}).catch(e => {
    console.trace(e)
    process.exit(1)
})
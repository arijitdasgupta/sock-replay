import dotenv from "dotenv"

// Loading configuration from environment
dotenv.config()

import  { createLogger } from "bunyan"

import { MongoDB } from "./db/MongoDB"
import { Config } from "./config/Config"
import { App } from "./http/App"
import { Metrics } from "./metrics/Metrics"

const run = async () => {
    // Configuration
    const config = new Config(process.env)

    // Logger
    const logger = createLogger({
        name: config.serviceName
    })

    // Metrics
    const metrics = new Metrics(config, logger)
    
    // Deps
    const dbClient = await new MongoDB(config, logger).connect()
    const app = new App(config, logger, metrics)

    // Run the HTTP Application
    await app.run()

    return { logger }
}

run().then(({logger}) => {
    logger.info("Application successfully started!")
}).catch(e => {
    console.trace(e)
    process.exit(1)
})
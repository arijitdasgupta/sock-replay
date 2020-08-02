import dotenv from "dotenv"

// Loading configuration from environment
dotenv.config()

import  { createLogger } from "bunyan"

import { MongoDB } from "./db/MongoDB"
import { Config } from "./config/Config"
import { App } from "./http/App"
import { Metrics } from "./metrics/Metrics"

const run = async () => {
    const logger = createLogger({
        name: "sock-replay"
    })

    // Configuration
    const config = new Config(process.env)

    // Metrics
    const metrics = new Metrics()
    
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
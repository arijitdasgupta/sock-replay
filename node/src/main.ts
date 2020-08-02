import  { createLogger } from "bunyan"
import dotenv from "dotenv"

// Loading configuration from environment
dotenv.config()

import { MongoDB } from "./db/MongoDB"
import { Config } from "./config/Config"
import { App } from "./http/App"

const run = async () => {
    const logger = createLogger({
        name: "sock-replay"
    })

    // Configuration
    const config = new Config(process.env)
    
    // Deps
    const dbClient = await new MongoDB(config, logger).connect()
    const app = new App(config, logger)

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
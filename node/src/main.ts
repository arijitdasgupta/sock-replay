import dotenv from "dotenv"

// Loading configuration from environment
dotenv.config()

import  { createLogger } from "bunyan"

import { Config } from "./config/Config"
import { App } from "./http/App"
import { Metrics } from "./metrics/Metrics"
import { SocketApp } from "./socket/SocketApp"
import { SocketSessionManagerSingleton } from "./lib/SocketSessionManagerSingleton"
import { PushService } from "./lib/PushService"
import { MessagesRepository } from "./db/MessagesRepository"
import { ForwardService } from "./lib/ForwardService"
import { Redis } from "./redis/Redis"

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
    const redis = new Redis(config, logger)
    const messagesRepository = new MessagesRepository(config, logger, redis.client)
    const forwardService = new ForwardService(config, logger)
    const socketSessionManager = new SocketSessionManagerSingleton(config, logger, metrics, messagesRepository, forwardService)
    const pushService = new PushService(messagesRepository, socketSessionManager)

    // Initiate the socket application
    const socketApp = new SocketApp(config, logger, socketSessionManager)
    await socketApp.run()

    // Run the HTTP Application
    const app = new App(config, logger, metrics, pushService)

    await app.run()
    socketSessionManager.run()

    return { logger }
}

run().then(({logger}) => {
    logger.info("Application successfully started!")
}).catch(e => {
    console.trace(e)
    process.exit(1)
})
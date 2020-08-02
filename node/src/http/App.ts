import express from "express"
import { Config } from "../config/Config"
import Logger from "bunyan"

export class App {
    private app: express.Application
    private logger: Logger
    private config: Config

    constructor(config: Config, logger: Logger) {
        this.app = express()
        this.config = config
        this.logger = logger.child({class: "App"})
        this.setRoutes()
    }

    private setRoutes() {
        this.app.get("/", (req: express.Request, res: express.Response) => {
            this.logger.info("Got request")
            res.send("Hello World")
        })
    }

    public run() {
        this.app.listen(this.config.httpPort, () => {
            this.logger.info(`Listening on ${this.config.httpPort}`)
        })
    }
}
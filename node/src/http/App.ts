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
        this.setRoutes(this.app)
    }

    private setRoutes(app: express.Application) {
        app.get("/", (req: express.Request, res: express.Response) => {
            this.logger.info("Got request")
            res.send("Hello World")
        })
    }

    public async run() {
        return new Promise((resolve, reject) => {
            try {
                this.app.listen(this.config.httpPort, () => {
                    this.logger.info(`HTTP App Listening on ${this.config.httpPort}`)
                    resolve()
                })
            } catch(e) {
                reject(e)
            }
        })
    }
}
import express from "express"
import { Config } from "../config/Config"
import Logger from "bunyan"
import { Metrics } from "../metrics/Metrics"
import prom, {register} from "prom-client"

export class App {
    private app: express.Application
    private requestCounter: prom.Counter<string>
    private className = "App"

    constructor(private config: Config, private logger: Logger, private metrics: Metrics) {
        this.app = express()
        this.config = config
        this.logger = logger.child({class: this.className})

        this.requestCounter = metrics.getCounter("http_req", "http-req")

        this.setRoutes(this.app)
    }

    private setRoutes(app: express.Application) {
        app.get("/", (req: express.Request, res: express.Response) => {
            this.requestCounter.inc()
            this.logger.info("Got request")
            res.send("Hello World")
        })

        app.get("/health", (_: express.Request, res: express.Response) => {
            res.status(200).send(this.metrics.register.metrics())
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
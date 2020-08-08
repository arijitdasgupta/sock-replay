import express from "express"
import bodyParser from "body-parser"
import Logger from "bunyan"
import prom from "prom-client"

import { Config } from "../config/Config"
import { Metrics } from "../metrics/Metrics"

import { PushService } from "../lib/PushService"
import { CustomErrors, ErrorTypes } from "../utils/errors"
import { SessionId } from "../../../common/lib/messages"

export class App {
    private app: express.Application
    private requestCounter: prom.Counter<string>
    private className = "App"

    constructor(private config: Config, private logger: Logger, private metrics: Metrics, private pushService: PushService) {
        this.app = express()
        this.config = config
        this.logger = logger.child({class: this.className})

        this.requestCounter = metrics.getCounter("http_req", "http-req")

        this.app.use(bodyParser.text())
        this.setRoutes(this.app)
    }

    // TODO: Refactor it out somewhere else
    private handleErrors(err: CustomErrors, res: express.Response) {
        if (err.errorType == ErrorTypes.SESSION_NOT_FOUND) {
            res.status(400).send(err.message)
        } else {
            this.logger.error(err)
            res.status(500).send("Internal server error")
        }
    }

    private handleOk(res: express.Response) {
        res.send("OK")
    }

    private setRoutes(app: express.Application) {
        app.post("/push/:sessionId", async (req: express.Request, res: express.Response) => {
            const sid = req.params.sessionId
            try {
                await this.pushService.pushToSession(new SessionId(sid), req.body)
                this.handleOk(res)
            } catch (e) {
                this.handleErrors(e, res)
            }
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
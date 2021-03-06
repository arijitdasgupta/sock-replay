import express from "express"
import bodyParser from "body-parser"
import Logger from "bunyan"
import prom from "prom-client"

import { Config } from "../config/Config"
import { Metrics } from "../metrics/Metrics"

import { PushService } from "../lib/PushService"
import { CustomErrors, ErrorTypes, SessionNotFound } from "../utils/errors"
import { SessionId } from "../../../web/src/lib/messages"
import { MessagesRepository } from "../db/MessagesRepository"

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

    private handleErrors(err: CustomErrors, res: express.Response) {
        if (err.errorType == ErrorTypes.SOCKET_NOT_FOUND) {
            res.status(400).send(err.message)
        } else if (err.errorType === ErrorTypes.SESSION_NOT_FOUND) {
            res.status(400).send(err.message)
        } else if (err.errorType === ErrorTypes.SOCKET_NOT_ATTACHED) {
            res.status(400).send(err.message)
        }
        else {
            this.logger.error(err)
            res.status(500).send("Internal server error")
        }
    }

    private handleOk(res: express.Response) {
        res.send("OK")
    }

    private setRoutes(app: express.Application) {
        app.delete("/push/:sessionId", async (req: express.Request, res: express.Response) => {
            const sid = new SessionId(req.params.sessionId)
            try {
                this.logger.debug(`HTTP Delete: ${sid.id}`)
                await this.pushService.deleteSession(sid)
                this.handleOk(res)
            } catch (e) {
                this.handleErrors(e, res)
            }
        })

        app.purge("/push/:sessionId", async (req: express.Request, res: express.Response) => {
            const sid = new SessionId(req.params.sessionId)
            try {
                this.logger.debug(`HTTP Purge: ${sid.id}`)
                await this.pushService.clearSession(sid)
                this.handleOk(res)
            } catch (e) {
                this.handleErrors(e, res)
            }
        })

        app.post("/push/:sessionId", async (req: express.Request, res: express.Response) => {
            const sid = new SessionId(req.params.sessionId)
            try {
                this.logger.debug(`HTTP Post: ${sid.id}`)
                await this.pushService.pushToSession(sid, req.body)
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
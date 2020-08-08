import socketio, { Socket } from "socket.io"
import { interval, from } from "rxjs"
import { flatMap, map, tap } from "rxjs/operators"
import Logger from "bunyan"
import prom from "prom-client"
import { v4 as uuidv4 } from "uuid";
import { Metrics } from "../metrics/Metrics";
import { MessagesRepository } from "../db/MessagesRepository";
import { parseMessage, MessageType, SessionId } from "../../../common/lib/messages";
import { Config } from "../config/Config";
import { SocketHorizon } from "../utils/SocketHorizon"

export class SocketSessionManagerSingleton {
    private socketMap: Map<string, SocketHorizon>
    private disconnectedSocketCounter: prom.Counter<string> // TODO: Implement usage
    private className = "SocketSessionManagerSingleton"

    constructor(private config: Config, private logger: Logger, metrics: Metrics, private messagesRepo: MessagesRepository) {
        this.socketMap = new Map<string, SocketHorizon>()
        this.disconnectedSocketCounter = metrics.getCounter("disconnected_socket_push", "Attempts to emit to disconnected socket")
        this.logger = this.logger.child({class: this.className})
        
        this.run()
    }

    private newSession = () => {
        return new SessionId(uuidv4())
    }

    private run = () => { // TODO: Clean up, tidy...
        interval(this.config.tickerInterval).pipe(
            flatMap(() => from(this.socketMap.entries())),
            map(([_key, horizon]) => horizon),
            flatMap((horizon) => {
                return from(this.messagesRepo.getQueueLength(horizon.sessionId)
                    .then((end) => ({ horizon, end })))
            }),
            tap(({ horizon, end}) => {
                this.socketMap.set(horizon.sessionId.id, horizon.setHorizon(end))
            }),
            flatMap(({ horizon, end }) => {
                return from(this.messagesRepo.getMessages(horizon.sessionId, horizon.horizon, end - 1)
                    .then((messages) => ({messages, horizon})))
            }),
            flatMap(({ messages, horizon }) => {
                return from(messages.map(message => ({message, horizon})))
            }),
        ).subscribe(({message, horizon}) => {
            const msg = message.toJSONString()
            horizon.socket.emit("msg", msg)
            this.logger.debug(`Sent message ${msg} to ${horizon.sessionId.id}`)
        })
        this.logger.info("Started ticker")
    }

    attach = (socket: Socket) => {
        socket.on("msg", async (message) => {
            try {
                this.logger.info(`Got message: ${message}`)
                const parsedMessage = parseMessage(message)

                if (parsedMessage.messageType === MessageType.NULL) {
                    const newSesh = this.newSession()
                    await this.messagesRepo.addSession(newSesh)
                    this.socketMap.set(newSesh.id, new SocketHorizon(socket, newSesh))
                } else if (parsedMessage.messageType === MessageType.INITIAL) {
                    if (await this.messagesRepo.hasSession(parsedMessage.sessionId)) {
                        this.socketMap.set(parsedMessage.sessionId.id, new SocketHorizon(socket, parsedMessage.sessionId))
                    }
                } else if (parsedMessage.messageType === MessageType.MESSAGE) {
                    // TODO: Forward messages
                }
            } catch (e) {
                this.logger.error(e)
            }
        })
    }
}
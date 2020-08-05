import socketio from "socket.io"
import Logger from "bunyan"
import prom from "prom-client"
import { v4 as uuidv4 } from "uuid";
import { Metrics } from "../metrics/Metrics";
import { MessagesRepository } from "../db/MessagesRepository";

export class SocketSessionManagerSingleton {
    private socketMap: Map<string, socketio.Socket>
    private disconnectedSocketCounter: prom.Counter<string>
    private className = "SocketSessionManagerSingleton"

    constructor(private logger: Logger, metrics: Metrics, private messagesRepo: MessagesRepository) {
        this.socketMap = new Map<string, socketio.Socket>()
        this.disconnectedSocketCounter = metrics.getCounter("disconnected_socket_push", "Attempts to emit to disconnected socket")
        this.logger = this.logger.child({class: this.className})        
    }

    private isSocketDisconnected = (socket: socketio.Socket): boolean => {
        return socket.disconnected
    }

    private deleteSock = (sessionId: string, sock: socketio.Socket): void => {
        this.socketMap.delete(sessionId)
        sock.disconnect()
    }

    private sendToSession = async (sessionId: string, data: any): Promise<void> => {
        if (await this.doesSessionExist(sessionId)) {
            const sock = this.socketMap.get(sessionId)
            if (this.isSocketDisconnected(sock)) {
                this.disconnectedSocketCounter.inc()
                this.logger.debug(`Attempted to push to disconnected socket. Removing socket from map`)
                this.deleteSock(sessionId, sock)
            } else {
                this.logger.debug(`Sending message to ${sessionId}: ${JSON.stringify(data)}`)
                sock.emit("msg", data)
            }
        } else {
            throw new Error(`No session found ${sessionId}`)
        }
    }

    doesSessionExist = async (sessionId: string): Promise<boolean> => {
        return !!(await this.messagesRepo.findBySessionId(sessionId))
    }

    attach(socket: socketio.Socket) {
        socket.on("initiate", async (data) => {
            if (!!data && !!data.id && this.doesSessionExist(data.id)) {
                this.socketMap.set(data.id, socket)
                const sessionId = data.id
                this.logger.debug(`Old session connected: ${sessionId}`)
                socket.emit("ack", {id: sessionId})
            } else {   
                const sessionId = uuidv4()
                await this.messagesRepo.addSession(sessionId)
                this.logger.debug(`New session connected: ${sessionId}`)
                this.socketMap.set(sessionId, socket)
                socket.emit("ack", {id: sessionId})
            }
        })
    }
}
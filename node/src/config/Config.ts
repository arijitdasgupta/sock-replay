import { parse } from "dotenv/types"

export class Config {
    public httpPort: number
    public serviceName: string
    public socketPort: number
    public redisPort: number;
    public redisHost: string;
    public messagesNamespace: string;
    public tickerInterval: number;

    constructor(env: any) {
        this.serviceName = env.SERVICE_NAME || "sock-replay"
        this.httpPort = isNaN(parseInt(env.HTTP_PORT)) ? 8080 : parseInt(env.HTTP_PORT)
        this.socketPort = isNaN(parseInt(env.SOCKET_PORT)) ? 9090 : parseInt(env.SOCKET_PORT)
        this.redisHost = env.REDIS_HOST
        this.redisPort = isNaN(env.REDIS_PORT) ? 6379 : parseInt(env.REDIS_PO)
        this.tickerInterval = 1000 // TODO push to ENV
        this.messagesNamespace = "session" // TODO push to ENV
    } 
}
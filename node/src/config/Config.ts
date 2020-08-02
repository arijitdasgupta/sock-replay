import { parse } from "dotenv/types"

export class Config {
    public dbUrl: string
    public httpPort: number
    public serviceName: string
    public dbName: string
    public socketPort: number

    constructor(env: any) {
        this.dbUrl = env.DB_URL
        this.serviceName = env.SERVICE_NAME || "sock-replay"
        this.dbName = env.MONGO_DB_NAME || "localdb"
        this.httpPort = isNaN(parseInt(env.HTTP_PORT)) ? 8080 : parseInt(env.HTTP_PORT)
        this.socketPort = isNaN(parseInt(env.SOCKET_PORT)) ? 9090 : parseInt(env.SOCKET_PORT)
    } 
}
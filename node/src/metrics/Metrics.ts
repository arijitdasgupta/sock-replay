import prom from "prom-client"
import Logger from "bunyan"
import { Config } from "../config/Config";

export class Metrics {
    public client: typeof prom
    public register: typeof prom.register
    public className = "Metrics"

    constructor(private config: Config, private logger: Logger) {
        const defaultLabels = { serviceName: config.serviceName };
        prom.register.setDefaultLabels(defaultLabels);

        this.client = prom
        this.register = prom.register
        this.logger = logger.child({class: this.className})

        this.logger.info("Initiated metrics")
    }

    getCounter(name: string, help: string) {
        return new this.client.Counter({
            name: `${name}`,
            help
        })
    }
}
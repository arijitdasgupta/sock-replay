import prom from "prom-client"

export class Metrics {
    public client: typeof prom
    public register: typeof prom.register

    constructor() {
        const defaultLabels = { serviceName: 'sock-replay' };
        prom.register.setDefaultLabels(defaultLabels);

        this.client = prom
        this.register = prom.register
    }

    getCounter(name: string, help: string) {
        return new this.client.Counter({
            name: `${name}`,
            help
        })
    }
}
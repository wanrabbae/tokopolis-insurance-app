import ConfigRepository from "../repositories/ConfigRepository";

export default class ConfigService {
    constructor() {
        this.repository = new ConfigRepository();
    }

    async getConfigs(limit, offset) {
        return await this.repository.getConfigs(limit, offset);
    }

    async getCount() {
        return await this.repository.getCount();
    }

    async getConfigByKey(key) {
        return await this.repository.getConfigByKey(key);
    }

    async createConfig(payload) {
        return await this.repository.createKey(payload);
    }

    async update(id, payload) {
        return await this.repository.updateKey(id, payload);
    }

    async destroy(id) {
        return await this.repository.deleteKey(id);
    }
}

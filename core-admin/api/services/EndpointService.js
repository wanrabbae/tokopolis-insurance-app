import EndpointRepository from '../repositories/EndpointRepository'

export default class EndpointService {
    constructor() {
        this.repository = new EndpointRepository()
    }

    async getRouteName(name) {
        const status = await this.repository.getRouteName(name)
        return status
    }

    async getRoutesName(payload) {
        for (const item of payload) {
            const status = await this.repository.getRouteName(item.name)
            if (status) return true
        }

        return false
    }

    async createEndpoint(payload) {
        for (const item of payload) {
            await this.repository.createEndpoint(item)
        }

        return true
    }

    async getEndpoint(id) {
        return await this.repository.getEndpoint(id)
    }

    async getCountByQuery(query) {
        if (query == null) {
            return await this.repository.getCountAll()
        }

        return this.repository.getCountByQuery(query)
    }

    getAll() {
        return this.repository.getAll()
    }

    async getEndpointAll(query, limit, offset) {
        if (query == null) {
            return await this.repository.getEndpoints(limit, offset)
        }

        return await this.repository.getEndpointAllWithFilter(query, limit, offset)
    }

    async update(id, payload) {
        return await this.repository.updateEndpoint(id,payload)
    }

    async deleteEndpoint(id) {
        return await this.repository.deleteEndpoint(id)
    }

}
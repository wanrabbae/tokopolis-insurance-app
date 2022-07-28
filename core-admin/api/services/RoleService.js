import RoleRepository from '../repositories/RoleRepository'

export default class EndpointService {
  constructor() {
    this.repository = new RoleRepository()
  }

  async getRoleName(name) {
    return await this.repository.getRoleName(name)
  }

  async createRole(payload) {
    const data = await this.repository.createRole(payload)

    for (const endpoint of payload.endpoints) {
      await this.repository.addEndpoint({
        role_id: data.id,
        endpoint_id: endpoint
      })
    }

    return true
  }

  getRoleAll(query, limit, offset) {
    return this.repository.getRoleAllWithFilter(query, limit, offset)
  }

  getCountByQuery(query) {
    return this.repository.getCountByQuery(query)
  }

  async getRoleById(id) {
    return await this.repository.getRoleById(id)
  }

  async update(id, payload) {
    return await this.repository.update(id,payload)
  }

  async destroy(id) {
    return await this.repository.destroy(id)
  }

  async endpointExist(payload) {
    return await this.repository.endpointExist(payload)
  }

  async addEndpoint(payload) {
    return await this.repository.addEndpoint(payload)
  }

  async removeEndpoint(id) {
    return await this.repository.removeEndpoint(id)
  }

}

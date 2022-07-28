const { Op } = require('sequelize')
const { Role, Endpoint, RoleEndpoint } = require('../models')

export default class RoleRepository {
  constructor() {}

  async getRoleName(name) {
    return await Role.findOne({ where: { name: name } })
  }

  async createRole(payload) {
    return await Role.create(payload)
  }

  async getRoleAllWithFilter(query, limit, offset) {
    return await Role.findAll({
      include: {
        model: RoleEndpoint,
        as: 'role_endpoints'
      },
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
        ]
      },
      limit: limit,
      offset: offset,
    })
  }

  async getCountAll() {
    return await Role.count()
  }

  async getCountByQuery(query) {
    return await Role.count({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
        ]
      },
    })
  }

  async getRoleById(id) {
    return await Role.findByPk(id)
  }

  async update(id,payload) {
    return await Role .update(payload, {
      where: { id: id }
    })
  }

  async destroy(id) {
    return await Role .destroy({
      where: { id: id }
    })
  }

  async addEndpoint(payload) {
    return await RoleEndpoint.create(payload)
  }

  async removeEndpoint(id) {
    return await RoleEndpoint.destroy({
      where: { id: id }
    })
  }

  async endpointExist(payload) {
    return await RoleEndpoint.findOne({
      where: { role_id: payload.role_id, endpoint_id: payload.endpoint_id }
    })
  }

}

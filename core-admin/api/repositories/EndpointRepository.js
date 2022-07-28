import {Product} from "../models";

const { Op } = require('sequelize')

const { Endpoint } = require('../models')

export default class EndpointRepository {
  constructor() {}

  async getRouteName(name) {
    return await Endpoint.findOne({ where: { name: name } })
  }

  async createEndpoint(payload) {
    return await Endpoint.create(payload)
  }

  async getCountAll() {
    return await Endpoint.count()
  }

  async getCountByQuery(query) {
    return await Endpoint.count({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { route: { [Op.like]: `%${query}%` } },
        ]
      },
    })
  }

  async getAll() {
    return await Endpoint.findAll()
  }

  async getEndpoints(limit, offset) {
    return await Endpoint.findAll({
      limit: limit,
      offset: offset,
    })
  }

  async getEndpointAllWithFilter(query, limit, offset) {
    return await Endpoint.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { route: { [Op.like]: `%${query}%` } },
        ]
      },
      limit: limit,
      offset: offset,
    })
  }

  async getEndpoint(id) {
    return await Endpoint.findByPk(id)
  }

  async updateEndpoint(id,payload) {
    return await Endpoint.update(payload, {
      where: { id: id }
    })
  }

  async deleteEndpoint(id) {
    return await Endpoint.destroy({
      where: { id: id }
    })
  }

}

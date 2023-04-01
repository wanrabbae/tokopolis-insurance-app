const { QueryTypes, Op } = require("sequelize");

const { sequelize, Role, RoleEndpoint, Endpoint, Account } = require("../models");

export default class RoleRepository {
    constructor() { }

    async getRoleName(name) {
        return await Role.findOne({ where: { name: name } });
    }

    async createRole(payload) {
        return await Role.create(payload);
    }

    async getRoleAllWithFilter(query, limit, offset) {
        return await Role.findAll({
            include: {
                model: Endpoint,
                as: "endpoints",
            },
            where: {
                [Op.or]: [{ name: { [Op.like]: `%${query}%` } }],
            },
            limit: limit,
            offset: offset,
        });
    }

    async getRoleTree(role_id) {
        return await Role.findAll({
            where: {
                id: {
                    [Op.lte]: role_id,
                },
            },
            include: {
                model: Account,
                as: "accounts",
                attributes: ["id", "fullname", "email"],
            },
        });
    }

    async getCountAll() {
        return await Role.count();
    }

    async getCountByQuery(query) {
        return await Role.count({
            where: {
                [Op.or]: [{ name: { [Op.like]: `%${query}%` } }],
            },
        });
    }

    async getRoleById(id) {
        return await Role.findByPk(id);
    }

    async update(id, payload) {
        return await Role.update(payload, {
            where: { id: id },
        });
    }

    async destroy(id) {
        return await Role.destroy({
            where: { id: id },
        });
    }

    async addEndpoint(payload) {
        return await RoleEndpoint.create(payload);
    }

    async removeEndpoint(id) {
        return await RoleEndpoint.destroy({
            where: { id: id },
        });
    }

    async endpointExist(payload) {
        return await RoleEndpoint.findOne({
            where: {
                role_id: payload.role_id,
                endpoint_id: payload.endpoint_id,
            },
        });
    }

    async getAllEndpointExist(role_id, endpoint, method) {
        console.log(endpoint);
        return await sequelize.query(
            `SELECT roles.id, endpoints.route, endpoints.method FROM roles ` +
            `JOIN role_endpoints ON role_endpoints.role_id = roles.id ` +
            `JOIN endpoints ON endpoints.id = role_endpoints.endpoint_id ` +
            `WHERE roles.id = '${role_id}' ` +
            `AND endpoints.route = '${endpoint}' ` +
            `AND endpoints.method = '${method}' `,
            { type: QueryTypes.SELECT }
        );
    }
}

import RoleService from "../../services/RoleService";
import EndpointService from "../../services/EndpointService";

const validation = require("../../validation/role.validation");

const service = new RoleService();
const endpointService = new EndpointService();

exports.create = async (req, res) => {
    const validate = validation.create(req);
    if (validate.error) return res.errorValidation(validate.details);

    const roleExist = await service.getRoleName(req.body.name);
    if (roleExist != null)
        return res.errorBadRequest(req.polyglot.t("error.role.exist"));

    const role = await service.createRole(req.body);

    return res.jsonData(role);
};

exports.list = async (req, res, next) => {
    const query = req.query.query || "";

    const current = Number(req.query.current) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (current - 1) * limit;

    const count = await service.getCountByQuery(query);
    const list = await service.getRoleAll(query, limit, offset);

    return res.jsonData({
        pagination: {
            total: count,
            per_page: limit,
            current_page: current,
            last_page: Math.ceil(count / limit),
        },
        list: list,
    });
};

exports.update = async (req, res) => {
    const validate = validation.create(req);
    if (validate.error) return res.errorValidation(validate.details);

    const role = await service.getRoleById(req.params.id);
    if (role == null)
        return res.errorBadRequest(req.polyglot.t("error.role.notfound"));

    if (role.name != req.body.name) {
        const roleExist = await service.getRoleName(req.body.name);
        if (roleExist != null)
            return res.errorBadRequest(req.polyglot.t("error.role.exist"));
    }

    await service.update(role.id, req.body);

    role.setEndpoints(req.body.endpoints)

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.destroy = async (req, res) => {
    await service.destroy(req.params.id);
    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.roleTree = async (req, res, next) => {
    const treeData = await service.getRoleTree(req.account.role);

    return res.jsonData(treeData);
};

exports.addEndpoint = async (req, res) => {
    const validate = validation.addEndpoint(req);
    if (validate.error) return res.errorValidation(validate.details);

    const role = await service.getRoleById(req.body.role_id);
    if (role == null)
        return res.errorBadRequest(req.polyglot.t("error.role.notfound"));

    const endpoint = await endpointService.getEndpoint(req.body.endpoint_id);
    if (endpoint == null)
        return res.errorBadRequest(req.polyglot.t("error.endpoint.notfound"));

    const isExist = await service.endpointExist(req.body);
    if (isExist)
        return res.errorBadRequest(req.polyglot.t("error.endpoint.exist"));

    const roleEndpoint = await service.addEndpoint(req.body);

    return res.jsonSuccess(req.polyglot.t("success.default"));
};

exports.removeEndpoint = async (req, res) => {
    await service.removeEndpoint(req.params.id);
    return res.jsonSuccess(req.polyglot.t("success.default"));
};

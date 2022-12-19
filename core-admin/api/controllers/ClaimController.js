import ClaimProductService from "../services/ClaimProductService.js";

const validation = require("../validation/user.validation");
const { randomString } = require("../utilities/functions");

const service = new ClaimProductService();

exports.getClaimProduct = async (req, res) => {
    try {
        const data = await service.getClaimProducts(req);
        return res.jsonData(data);
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.getDetailClaimProduct = async (req, res) => {
    try {
        const data = await service.getDetailData(req.params.id);
        return res.jsonData(data);
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

exports.claimProduct = async (req, res) => {
    try {
        await service.createClaimProduct(req.body);
        return res.jsonSuccess("Success request claim product");
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

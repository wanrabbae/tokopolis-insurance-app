import ClaimProductService from "../../services/ClaimProductService.js";

const validation = require("../../validation/user.validation");
const { randomString } = require("../../utilities/functions");

const service = new ClaimProductService();

exports.getAllClaimData = async (req, res) => {
    try {
        const data = await service.getAllData();
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

exports.updateStatusClaim = async (req, res) => {
    try {
        await service.updateStatusData(req.body);
        return res.jsonSuccess("Success update staging");
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

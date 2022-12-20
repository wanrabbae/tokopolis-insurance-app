import ClaimProductService from "../services/ClaimProductService.js";

const validation = require("../validation/claim.validation");
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
        const validate = validation.claimProduct(req);
        if (validate.error) return res.errorValidation(validate.details);
        // await service.createClaimProduct(req.body);
        console.log(req.body);
        console.log(req.files);
        service.sendEmailRequestClaimSuccess({
            host: req.fullhost,
            target: account.email,
            title: req.polyglot.t("mail.request_claim"),
            data: {
                name: transaction.client_data.fullname,
                platform: data.name,
                virtual_number: data.virtual_number,
                total: moneyFormat(data.amount),
                date: data.due,
            },
        });
        return res.jsonSuccess("Success request claim product");
    } catch (error) {
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

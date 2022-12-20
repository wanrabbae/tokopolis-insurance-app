import ClaimProductService from "../services/ClaimProductService.js";
import TransactionService from "../services/TransactionService.js";
import ProductService from "../services/ProductService.js";

const validation = require("../validation/claim.validation");
const { randomString } = require("../utilities/functions");

const service = new ClaimProductService();
const transactionService = new TransactionService();
const productService = new ProductService();

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

        const checkTransaction = await transactionService.getTransactionDetail(
            req.body.transaction_id
        );
        if (!checkTransaction) {
            return res.errorBadRequest(
                req.polyglot.t("error.claim.transaction.check")
            );
        }

        if (
            new Date(req.body.incident_time) <
            new Date(checkTransaction.start_date)
        ) {
            return res.errorBadRequest(
                req.polyglot.t("error.claim.incident_time")
            );
        }

        const checkProduct = await productService.getProduct(
            req.query.product_id
        );

        if (!checkProduct) {
            return res.errorBadRequest(req.polyglot.t("error.product"));
        }

        await service.createClaimProduct(req, req.files);

        service.sendEmailRequestClaimSuccess({
            host: req.fullhost,
            target: account.email,
            title: req.polyglot.t("mail.request_claim"),
            data: {
                name: transaction.client_data.fullname,
                date: new Date().toDateString(),
            },
        });
        return res.jsonSuccess("Success request claim product");
    } catch (error) {
        console.log(error);
        return res.jsonData({
            message: "Something went wrong!",
            error: error.toString(),
        });
    }
};

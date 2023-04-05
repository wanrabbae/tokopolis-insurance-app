import ClaimProductService from "../services/ClaimProductService.js";
import TransactionService from "../services/TransactionService.js";
import ProductService from "../services/ProductService.js";
import { randomNumber } from "../utilities/functions";

const validation = require("../validation/claim.validation");
const { randomString, getMoment } = require("../utilities/functions");

const service = new ClaimProductService();
const transactionService = new TransactionService();
const productService = new ProductService();

const getClaimID = () => {
    const now = getMoment().format("yyyyMMDD");
    const nowHour = getMoment().format("HHmmss");
    const postfix = randomNumber(1111, 9999);

    return `CLM-${now}-${nowHour}-${postfix}`;
};

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

        const checkTransaction = await transactionService.getTransactionDetail(req.body.transaction_id)
        if (checkTransaction.length <= 0) return res.errorBadRequest(req.polyglot.t("error.claim.transaction.check"))

        if (
            new Date(req.body.incident_time) <
            new Date(checkTransaction[0].start_date)
        ) {
            return res.errorBadRequest(
                req.polyglot.t("error.claim.incident_time")
            );
        }

        const checkProduct = await productService.getProduct(checkTransaction[0].product_id)
        if (!checkProduct) return res.errorBadRequest(req.polyglot.t("error.product"))

        await service.createClaimProduct({
            id: getClaimID(),
            account_id: req.account._id,
            transaction_id: req.body.transaction_id,
            product_id: checkTransaction[0].product_id,
            reporter_fullname: req.body.reporter_fullname,
            holder_fullname: req.body.holder_fullname,
            plate_number: req.body.plate_number,
            incident_time: req.body.incident_time,
            location: req.body.location,
            chronology: req.body.chronology,
        }, req.files);

        service.sendEmailRequestClaimSuccess({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: req.account.email,
            title: req.polyglot.t("mail.request_claim"),
            data: {
                name: transaction.client_data.fullname,
                reporter_fullname: req.body.reporter_fullname,
                holder_fullname: req.body.holder_fullname,
                incident_time: req.body.incident_time
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

const moment = require("moment");

import VehicleService from "../services/VehicleService";
import ProductService from "../services/ProductService";

const validation = require("../validation/product.validation");
const { getMoment } = require("../utilities/functions");
const { loadingRate } = require("../utilities/calculation");

const service = new ProductService();
const vehicleService = new VehicleService();

exports.productCalculation = async (req, res, next) => {
    const sess = Object.assign({}, req.session.vehicle);

    const validate = validation.calculate(req);
    if (validate.error && Object.keys(sess).length == 0)
        return res.errorValidation(validate.details);

    const query = () => {
        // Complete parameters
        if (!validate.error) {
            req.session.vehicle = req.query;
        }

        return req.session.vehicle;
    };

    const body = query();
    const vehicle = await vehicleService.getVehiclePrice(
        body.year,
        body.brand,
        body.model,
        body.sub_model
    );

    if (
        body.price < vehicle.lowest_price ||
        body.price > vehicle.highest_price
    ) {
        req.session.vehicle = null;
        return res.errorBadRequest(req.polyglot.t("error.vehicle.price"));
    }

    if (
        (body.use == "private" && !vehicle.is_private) ||
        (body.use == "commercial" && !vehicle.is_commercial)
    ) {
        req.session.vehicle = null;
        return res.errorBadRequest(req.polyglot.t("error.vehicle.function"));
    }

    if (
        (body.protection == "comprehensive" && !vehicle.is_comprehensive) ||
        (body.protection == "tlo" && !vehicle.is_tlo)
    ) {
        req.session.vehicle = null;
        return res.errorBadRequest(req.polyglot.t("error.vehicle.protection"));
    }

    const plate = await vehicleService.getPlateData(body.plate);
    const accessories = vehicleService.getAccessoriesJson(body.acc);

    const accPriceTotal = vehicleService.getAccessoriesTotalPrice(accessories);
    const priceTotal = Number(body.price) + accPriceTotal;
    const premiumRate = service.getPremiumPrice(
        priceTotal,
        vehicle.category_code,
        plate.zone,
        body.protection
    );

    res.locals.price = premiumRate * priceTotal;

    const startDate = () => {
        if (
            body.start_date == null ||
            (body.start_date != null &&
                moment(body.start_date).diff(moment()) < 0)
        ) {
            return getMoment().format("YYYY-MM-DD");
        }

        return body.start_date;
    };

    const loadingRateValue =
        res.locals.price * loadingRate(startDate(), req.session.vehicle.year);

    if (req.session.product == undefined) {
        req.session.product = {};
    }

    req.session.vehicle.id = vehicle.id;
    req.session.vehicle.capacity = vehicle.capacity;
    req.session.vehicle.zone = plate.zone;
    req.session.vehicle.use = body.use;
    req.session.vehicle.price = Number(body.price); // Convert price to number
    req.session.vehicle.accessories = accessories;

    req.session.product.start_date = startDate();
    req.session.product.rate = premiumRate;
    req.session.product.loading_rate = loadingRateValue;
    req.session.product.price = res.locals.price + loadingRateValue;

    next();
};

exports.getProductData = async (req, res) => {
    const page = Number(req.query.page) || 1;

    const startYear = moment(req.session.product.start_date).format('YYYY')
    const vehicleAge = Number(startYear - req.session.vehicle.year)

    const payload = {
        brand: req.session.vehicle.brand,
        protection: req.session.vehicle.protection,
        vehicle_age: vehicleAge,
    };

    var returnData = {};

    // Guest checking
    if (req.account != null) {
        const limit = 5;
        const offset = (page - 1) * limit;

        const count = await service.getCountByVehicle(payload);
        const data = await service.getProductList(
            payload,
            limit,
            offset,
            req.session.product.price
        );

        returnData = {
            pagination: {
                total: count,
                per_page: limit,
                current_page: page,
                last_page: Math.ceil(count / limit),
            },
            data: data,
        };
    } else {
        const data = await service.getProductList(
            payload,
            3,
            0,
            req.session.product.price
        );

        returnData = { data: data };
    }

    req.session.product.expansion = [];
    req.session.product.expansion_price = 0;

    return res.jsonData(returnData);
};

exports.getProductDetail = async (req, res) => {
    const validate = validation.detail(req);
    if (validate.error) return res.errorValidation(validate.details);

    const product = await service.getProduct(req.query.id);
    if (product == null)
        return res.errorBadRequest(req.polyglot.t("error.product"));

    product.dataValues.price = req.session.product.price;

    req.session.product.extra_point = product.extra_point
    req.session.product.admin_fee = product.admin_fee
    req.session.product.stamp_fee = product.stamp_fee

    return res.jsonData(product);
};

exports.compareProduct = async (req, res) => {
    const sess = Object.assign({}, req.session.compare);

    const validate = validation.compare(req);
    if (validate.error && Object.keys(sess).length == 0)
        return res.errorValidation(validate.details);

    const product_ids = () => {
        // complete parameter
        if (!validate.error) {
            req.session.compare = Object.values(req.query);
        }

        return req.session.compare;
    };

    const product_price = req.session.product.price;

    const ids = product_ids();
    const products = await service.getProductsComparation(ids, product_price);

    if (products.length != ids.length) {
        return res.errorBadRequest(req.polyglot.t("error.compare.product"));
    }

    return res.jsonData(products);
};

exports.riskExpansion = async (req, res) => {
    const validate = validation.expand(req);
    if (validate.error) return res.errorValidation(validate.details);

    if (req.session.vehicle == null)
        return res.errorBadRequest(req.polyglot.t("error.vehicle.data"));

    const vehicle = req.session.vehicle;
    const expansions = await service.getExpansionList(vehicle, req.query.id);

    return res.jsonData(expansions);
};

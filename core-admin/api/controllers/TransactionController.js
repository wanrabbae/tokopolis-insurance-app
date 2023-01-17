const moment = require("moment");
const axios = require("axios");

import AccountService from "../services/AccountService";
import ProductService from "../services/ProductService";
import TransactionService from "../services/TransactionService";
import PaymentService from "../services/PaymentService";
import PdfService from "../services/PdfService";

const validation = require("../validation/transaction.validation");
const {
    getMoment,
    moneyFormat,
    moneyFormatNonSymbol,
    phoneFormat,
    randomNumber,
    titleCase,
    percentToDecimal,
} = require("../utilities/functions");
const { toPercent } = require("../utilities/calculation");

const service = new TransactionService();
const accountService = new AccountService();
const productService = new ProductService();
const paymentService = new PaymentService();
const pdfService = new PdfService();

exports.getAll = async (req, res) => {
    const account = await accountService.getAccountData(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    const transaction = await service.getClientTransactionAll(account.id);
    if (transaction == null)
        return res.errorBadRequest(req.polyglot.t("error.transaction"));

    return res.jsonData(transaction);
};

exports.transaction = async (req, res) => {
    const account = await accountService.getAccountData(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    if (req.query.transaction_id != null) {
        const transaction = await service.getAgentTransactionDetail(
            account.id,
            req.query.transaction_id
        );
        if (transaction == null)
            return res.errorBadRequest(req.polyglot.t("error.transaction"));

        const expansionPrice = productService.getExpansionTotalPrice(
            transaction.expansions
        );

        return res.jsonData({
            plate: transaction.vehicle_data.plate,
            price: {
                product: transaction.price,
                expansion: expansionPrice,
                fee_admin: transaction.fee_admin,
                fee_stamp: transaction.fee_stamp,
                discount: getDiscountValue(
                    transaction.price,
                    expansionPrice,
                    transaction.discount_format,
                    transaction.discount_value
                ),
            },
            client: {
                fullname: transaction.client_data.fullname,
                email:
                    transaction.client_data.email != "null"
                        ? transaction.client_data.email
                        : null,
                phone:
                    transaction.client_data.phone != "null"
                        ? transaction.client_data.phone
                        : null,
            },
        });
    } else {
        if (req.session.product?.price == null)
            return res.errorBadRequest(req.polyglot.t("error.product.data"));

        return res.jsonData({
            plate: req.session.vehicle?.plate,
            price: {
                product: req.session.product?.price,
                expansion: req.session.product.expansion_price,
                fee_admin: req.session.product.admin_fee,
                fee_stamp: req.session.product.stamp_fee,
                discount: getDiscountValue(
                    req.session.product?.price,
                    req.session.product.expansion_price,
                    req.session.product.discount_format,
                    req.session.product.discount_value
                ),
            },
        });
    }
};

exports.detail = async (req, res, next) => {
    const data = await service.getTransactionDetailForClient(req.params.id)
    if (data.length <= 0) return res.errorBadRequest(req.polyglot.t('error.transaction'))

    return res.jsonData(data[0])
}

const getExpansions = async (product_id, vehicle, expansionInput) => {
    const expList = await productService.getExpansionList(vehicle, product_id);
    const json = productService.getExpansionJson(expansionInput);
    const expansions = productService.getExpansionWithPrice(expList, json);
    const expansionPrice = productService.getExpansionTotalPrice(expansions);

    return {
        list: expansions,
        price: expansionPrice || 0,
    };
};

const getTransactionID = () => {
    const now = getMoment().format("yyyyMMDD");
    const nowHour = getMoment().format("HHmmss");
    const postfix = randomNumber(1111, 9999);

    return `TKP-${now}-${nowHour}-${postfix}`;
};

const getDiscountValue = (productPrice, expansionPrice, format, value) => {
    switch (format) {
        case "amount":
            return value;
        case "percent":
            return percentToDecimal(value) * (productPrice + expansionPrice);
        default:
            return 0;
    }
};

const fetchImage = async (src) => {
    const image = await axios
        .get(src, {
            responseType: "arraybuffer",
        })
        .catch();

    if (!image) return null;

    return image.data;
};

const generateQuotation = async (payload) => {
    const productLogo = await fetchImage(
        `${process.env.REDIRECT_ADMIN}${payload.product.image}`
    );
    const calculation = [
        {
            label: titleCase(payload.product.type),
            price: moneyFormatNonSymbol(payload.vehicle_data.price),
            percentage: `${toPercent(payload.rate)}%`,
            total: moneyFormatNonSymbol(payload.price),
        },
    ];

    const simpleMillionFormat = (value) => {
        return `Rp. ${value / 1000000} Juta`;
    };

    payload.expansions.forEach((expansion) => {
        if ("value" in expansion) {
            if ("count" in expansion) {
                calculation.push({
                    label: `${expansion.label} senilai ${simpleMillionFormat(
                        expansion.value
                    )} (${expansion.count} orang)`,
                    price: moneyFormatNonSymbol(expansion.value),
                    percentage: `${toPercent(expansion.rate)}% x ${
                        expansion.count
                    }`,
                    total: moneyFormatNonSymbol(expansion.price),
                });
            } else {
                calculation.push({
                    label: `${expansion.label} senilai ${simpleMillionFormat(
                        expansion.value
                    )}`,
                    price: moneyFormatNonSymbol(expansion.value),
                    percentage: `${toPercent(expansion.rate)}%`,
                    total: moneyFormatNonSymbol(expansion.price),
                });
            }
        } else {
            calculation.push({
                label: expansion.label,
                price: moneyFormatNonSymbol(payload.vehicle_data.price),
                percentage: `${toPercent(expansion.rate)}%`,
                total: moneyFormatNonSymbol(expansion.price),
            });
        }
    });

    // Add Discount
    if (payload.discount_total > 0) {
        const expansionPriceTotal = payload.expansions.reduce((a, b) => a + b.price, 0)

        if (payload.discount_format == "percent") {
            calculation.push({
                label: "Diskon",
                price: moneyFormatNonSymbol(payload.price + expansionPriceTotal),
                percentage: `${payload.discount_value}%`,
                total: moneyFormatNonSymbol(-payload.discount_total),
            });
        } else {
            calculation.push({
                label: "Diskon",
                price: moneyFormatNonSymbol(payload.discount_total + expansionPriceTotal),
                total: moneyFormatNonSymbol(-payload.discount_total),
            });
        }
    }

    calculation.push({
        label: "Biaya Admin",
        price: moneyFormatNonSymbol(payload.fee_admin),
        total: moneyFormatNonSymbol(payload.fee_admin),
    });

    calculation.push({
        label: "Biaya Materai",
        price: moneyFormatNonSymbol(payload.fee_stamp),
        total: moneyFormatNonSymbol(payload.fee_stamp),
    });

    const data = {
        logo: {
            product: productLogo,
        },
        header: [
            {
                label: "Nomor",
                text: payload.id,
            },
            {
                label: "Jenis Asuransi",
                text: "Asuransi Kendaraan Bermotor (PSAKBI)",
            },
            {
                label: "Tanggal Terbit",
                text: moment(payload.created_at).format("LLL"),
            },
        ],
        detail: [
            {
                label: "Nama Tertanggung",
                text: payload.client_data.fullname,
            },
            {
                label: "Nama Produk",
                text: payload.product.name,
            },
            {
                label: "Tipe Perlindungan",
                text: titleCase(payload.product.type),
            },
            {
                label: "Periode Asuransi",
                text: `${moment(payload.start_date).format("LL")} - ${moment(
                    payload.start_date
                )
                    .add(1, "y")
                    .format("LL")}`,
            },
        ],
        vehicle: [
            {
                label: "Merk",
                text: payload.vehicle.brand,
            },
            {
                label: "Model",
                text: payload.vehicle.sub_model,
            },
            {
                label: "Tipe",
                text: payload.vehicle.vehicle_type,
            },
            {
                label: "Kategori",
                text: payload.vehicle.category,
            },
            {
                label: "Tahun Pembuatan",
                text: payload.vehicle_data.year,
            },
            // {
            //     label: 'Kategori Lokasi',
            //     text: ''
            // },
            // {
            //     label: 'Fungsi Kendaraan',
            //     text: ''
            // },
        ],
        calculation: calculation,
        currency: "IDR",
        total: moneyFormatNonSymbol(payload.total),
        link: `${process.env.REDIRECT_CLIENT}/asuransi/mobil/polis/pembelian?id=${payload.id}`,
    };

    return await pdfService.createInvoice(
        data,
        `view/static/quotation/${payload.id}.pdf`
    );
};

exports.postOffer = async (req, res) => {
    const validate = validation.postOffer(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await accountService.getAccount(req.account._id);

    const vehicle = {
        year: req.session.vehicle.year,
        capacity: req.session.vehicle.capacity,
        zone: req.session.vehicle.zone,
        plate: req.session.vehicle.plate,
        accessories: req.session.vehicle.accessories,
        price: req.session.vehicle.price,
    };

    const client = {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
    };

    const expansion = await getExpansions(
        req.body.product_id,
        req.session.vehicle,
        req.body.exp
    );

    const discountFormat = req.body.discount_format;
    const discountValue = req.body.discount_value || 0;
    const discountMaxPercent = 25;
    const discountMaxAmount = getDiscountValue(
        req.session.product.price,
        expansion.price,
        "percent",
        discountMaxPercent
    );

    // If agent give discount
    if (
        (discountValue != 0 &&
            discountFormat == "amount" &&
            discountValue > discountMaxAmount) ||
        (discountFormat == "percent" && discountValue > discountMaxPercent)
    ) {
        return res.errorBadRequest(
            req.polyglot.t("error.transaction.discount")
        );
    }

    const discountTotal = getDiscountValue(
        req.session.product.price,
        expansion.price,
        discountFormat,
        discountValue
    );

    const newOffer = await service.createOffer({
        id: getTransactionID(),
        agent_id: account.id,
        vehicle_id: req.session.vehicle.id,
        product_id: req.body.product_id,
        client_data: client,
        is_new_condition: true,
        vehicle_data: vehicle,
        start_date: req.session.product.start_date,
        rate: req.session.product.rate,
        price: req.session.product.price,
        discount_format: discountFormat,
        discount_value: discountValue,
        discount_total: discountTotal,
        loading_rate: req.session.product.loading_rate,
        expansions: expansion.list,
        fee_admin: req.session.product.admin_fee,
        fee_stamp: req.session.product.stamp_fee,
        total:
            req.session.product.price +
            expansion.price +
            req.session.product.admin_fee +
            req.session.product.stamp_fee -
            discountTotal,
    });

    if (!newOffer)
        return res.errorBadRequest(req.polyglot.t("error.transaction.create"));

    const transaction = await service.getAgentTransactionDetail(
        account.id,
        newOffer.id
    );

    await generateQuotation(transaction);

    return res.jsonData({
        transaction_id: newOffer.id,
    });
};

exports.postTemporary = async (req, res) => {
    const validate = validation.postTemporary(req);
    if (validate.error) return res.errorValidation(validate.details);

    const expansion = await getExpansions(
        req.body.product_id,
        req.session.vehicle,
        req.body.exp
    );

    const discountFormat = req.body.discount_format;
    const discountValue = req.body.discount_value || 0;

    const discountMaxPercent = 25;
    const discountMaxAmount = getDiscountValue(
        req.session.product.price,
        expansion.price,
        "percent",
        discountMaxPercent
    );

    // If agent give discount
    if (
        (discountValue != 0 &&
            discountFormat == "amount" &&
            discountValue > discountMaxAmount) ||
        (discountFormat == "percent" && discountValue > discountMaxPercent)
    ) {
        return res.errorBadRequest(
            req.polyglot.t("error.transaction.discount")
        );
    }

    const discountTotal = getDiscountValue(
        req.session.product.price,
        expansion.price,
        discountFormat,
        discountValue
    );

    req.session.product.expansion = expansion.list;
    req.session.product.expansion_price = expansion.price;

    req.session.product.discount_format = discountFormat;
    req.session.product.discount_value = discountValue;
    req.session.product.discount_total = discountTotal;

    return res.jsonSuccess();
};

const setTransactionBonus = async (payload) => {
    const discountMaxPercent = 25;
    const totalPriceForComission = payload.price + payload.expansion_price;

    var comissionValue = 0

    if (payload.discount_format == "percent") {
        comissionValue = totalPriceForComission * (Math.abs(payload.discount_value -  discountMaxPercent) / 100)
    } else {
        comissionValue = totalPriceForComission * (25 / 100) - payload.discount_value
    }

    if (comissionValue > 0) {
        await service.createComission({
            account_id: payload.account_id,
            transaction_id: payload.transaction_id,
            value: comissionValue,
        })
    }

    // add points here
    if (payload.extra_point) {
        // for agent
        const pointValue = totalPriceForComission * (payload.extra_point / 100) / 1000;
        await service.createPoint({
            account_id: payload.account_id,
            transaction_id: payload.transaction_id,
            value: pointValue,
        });

        const findUniqueId = await accountService.getAccountData(payload.account_id);
        const uniqueCodeArray = findUniqueId.unique_id.split("-");
        const leaderPointValue = (totalPriceForComission * (5 / 100)) / 1000

        // for supervisor
        const spvCode = uniqueCodeArray.slice(0, -1).join("-");
        const findAccountSpv = await accountService.getAccountWithUniqueId(spvCode);

        if (findAccountSpv) {
            await service.createPoint({
                account_id: findAccountSpv.id,
                transaction_id: payload.transaction_id,
                value: leaderPointValue,
            });
        }

        // for branch head
        const bhCode = uniqueCodeArray.slice(0, -2).join("-");
        const findAccountBH = await accountService.getAccountWithUniqueId(bhCode);

        if (findAccountBH) {
            await service.createPoint({
                account_id: findAccountBH.id,
                transaction_id: payload.transaction_id,
                value: leaderPointValue,
            });
        }
    }
}

exports.postTransaction = async (req, res) => {
    const validate = validation.post(req);
    if (validate.error) return res.errorValidation(validate.details);

    if (req.account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));
    if (req.query.product_id == null)
        return res.errorBadRequest(req.polyglot.t("error.product.data"));

    const usingTransactionID = req.body.transaction_id != null;

    if (!usingTransactionID && req.session.vehicle == null)
        return res.errorBadRequest(req.polyglot.t("error.vehicle.data"));

    const account = await accountService.getAccount(req.account._id);
    const condition = req.body.condition == "new" ? true : false;

    const validateFile = condition
        ? validation.fileNew(req)
        : validation.fileOld(req);
    if (validateFile.error) return res.errorValidation(validateFile.details);

    if (condition && req.body.plate_detail != null)
        return res.errorBadRequest(req.polyglot.t("error.vehicle.plate.new"));
    else if (!condition && req.body.plate_detail == null)
        return res.errorBadRequest(req.polyglot.t("error.vehicle.plate.old"));

    const client = {
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
    };

    if (usingTransactionID) {
        const transaction = await service.getAgentTransactionDetail(
            account.id,
            req.body.transaction_id
        );
        if (transaction == null)
            return res.errorBadRequest(req.polyglot.t("error.transaction"));

        const updatedTransaction = await service.updateTransaction(
            transaction.id,
            {
                address_village_id: req.body.address_village_id,
                address_detail: req.body.address_detail,
                is_address_used_to_ship:
                    req.body.use_address_to_ship === "true",
                is_new_condition: condition,
                client_data: client, // update
                vehicle_data: {
                    // update
                    year: transaction.vehicle_data.year,
                    capacity: transaction.vehicle_data.capacity,
                    zone: transaction.vehicle_data.zone,
<<<<<<< HEAD
=======
                    use: transaction.vehicle_data.use,
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
                    plate: transaction.vehicle_data.plate,
                    accessories: transaction.vehicle_data.accessories,

                    plate_detail: req.body.plate_detail,
                    color: req.body.vehicle_color,
                    machine_number: req.body.machine_number,
                    skeleton_number: req.body.skeleton_number,

                    price: transaction.vehicle_data.price,
                },
            },
            req.files
        );

        if (!updatedTransaction)
            return res.errorBadRequest(
                req.polyglot.t("error.transaction.create")
            );

        if (req.account != null && req.account.role == 5) {
            await setTransactionBonus({
                account_id: req.account._id,
                transaction_id: transaction.id,
                discount_format: transaction.discount_format,
                discount_value: transaction.discount_value,
                extra_point: transaction.product.extra_point,
                price: transaction.price,
                expansion_price: transaction.expansions.reduce((a, b) => a + b.price, 0),
            })
        }

        return res.jsonData({
            transaction_id: transaction.id,
        });
    }

    const newTransaction = await service.createTransaction(
        {
            id: getTransactionID(),
            agent_id: account.id,
            vehicle_id: req.session.vehicle.id,
            product_id: req.query.product_id,
            client_data: client,
            address_village_id: req.body.address_village_id,
            address_detail: req.body.address_detail,
            is_address_used_to_ship: req.body.use_address_to_ship === "true",
            is_new_condition: condition,
            vehicle_data: {
                year: req.session.vehicle.year,
                capacity: req.session.vehicle.capacity,
                zone: req.session.vehicle.zone,
<<<<<<< HEAD
=======
                use: req.session.vehicle.use,
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3
                plate: req.session.vehicle.plate,
                accessories: req.session.vehicle.accessories,

                plate_detail: req.body.plate_detail,
                color: req.body.vehicle_color,
                machine_number: req.body.machine_number,
                skeleton_number: req.body.skeleton_number,

                price: req.session.vehicle.price,
            },
            start_date: req.session.product.start_date,
            rate: req.session.product.rate,
            price: req.session.product.price,
            discount_format: req.session.product.discount_format,
            discount_value: req.session.product.discount_value,
            discount_total: req.session.product.discount_total,
            loading_rate: req.session.product.loading_rate,
            expansions: req.session.product.expansion,
            fee_admin: req.session.product.admin_fee,
            fee_stamp: req.session.product.stamp_fee,
            total:
                req.session.product.price +
                req.session.product.expansion_price +
                req.session.product.admin_fee +
                req.session.product.stamp_fee -
                req.session.product.discount_total,
        },
        req.files
    );

    if (!newTransaction)
        return res.errorBadRequest(req.polyglot.t("error.transaction.create"));

    if (req.account != null && req.account.role == 5) {
        await setTransactionBonus({
            account_id: req.account._id,
            transaction_id: newTransaction.id,
            discount_format: req.session.product.discount_format,
            discount_value: req.session.product.discount_value,
            extra_point: req.session.product.extra_point,
            price: req.session.product.price,
            expansion_price: req.session.product.expansion_price,
        })
    }

    return res.jsonData({
        transaction_id: newTransaction.id,
    });
};

const getPaymentGatewayFee = async (platform, total) => {
    const result = await paymentService.getFee({
        platform: platform,
        total: total,
    });

    if (!result) return null;

    return result.data;
};

exports.review = async (req, res) => {
    const validate = validation.review(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await accountService.getAccountData(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    const transaction = await service.getAgentTransactionDetail(
        account.id,
        req.query.transaction_id
    );
    if (transaction == null)
        return res.errorBadRequest(req.polyglot.t("error.transaction"));

    var client = null;

    if (transaction.client_data) {
        const village = transaction.village;
        const district = village?.address_district;
        const regency = district?.address_regency;
        const province = regency?.address_province;

        client = {
            fullname: transaction.client_data.fullname,
            email:
                transaction.client_data.email != "null"
                    ? transaction.client_data.email
                    : null,
            phone:
                transaction.client_data.phone != "null"
                    ? transaction.client_data.phone
                    : null,
            address: {
                detail: transaction.address_detail,
                village: titleCase(village.name),
                district: titleCase(district.name),
                regency: titleCase(regency.name),
                province: titleCase(province.name),
            },
        };
    }

    return res.jsonData({
        client: client,
        vehicle: {
            condition: transaction.is_new_condition ? true : false,
            brand: transaction.vehicle.brand,
            model: transaction.vehicle.model,
            sub_model: transaction.vehicle.sub_model,
            year: transaction.vehicle_data?.year,
            price: transaction.vehicle_data?.price,
            plate: transaction.vehicle_data?.plate,
            plate_detail: transaction.vehicle_data?.plate_detail,
            protection: transaction.product.type,
            color: transaction.vehicle_data?.color,
            machine_number: transaction.vehicle_data?.machine_number,
            skeleton_number: transaction.vehicle_data?.skeleton_number,
        },
        transaction: {
            id: transaction.id,
            product: transaction.product?.name,
            product_company: transaction.product?.company,
            start_date: transaction.start_date,
            price: transaction.price,
            discount_format: transaction.discount_format,
            discount_value: transaction.discount_value,
            discount_total: transaction.discount_total,
            documents: transaction.documents,
            expansions: transaction.expansions,
            fee_admin: transaction.fee_admin,
            fee_stamp: transaction.fee_stamp,
        },
    });
};

exports.getPaymentFee = async (req, res) => {
    const validate = validation.getPaymentFee(req);
    if (validate.error) return res.errorValidation(validate.details);

    const paymentRequest = await getPaymentGatewayFee(
        req.query.platform,
        req.query.total
    );

    return res.jsonData(paymentRequest);
};

exports.doPayment = async (req, res) => {
    const validate = validation.createPayment(req);
    if (validate.error) return res.errorValidation(validate.details);

    const account = await accountService.getAccountData(req.account._id);
    if (account == null)
        return res.errorBadRequest(req.polyglot.t("error.auth"));

    const transaction = await service.getAgentTransactionDetail(
        account.id,
        req.body.transaction_id
    );
    if (transaction == null)
        return res.errorBadRequest(req.polyglot.t("error.transaction"));

    const paymentFee = await getPaymentGatewayFee(
        req.body.platform,
        transaction.total
    );

    const payload = {
        order_id: transaction.id,
        customer: {
            fullname: transaction.client_data.fullname,
            email:
                transaction.client_data.email != "null"
                    ? transaction.client_data.email
                    : account.email,
            phone:
                transaction.client_data.phone != "null"
                    ? phoneFormat(transaction.client_data.phone)
                    : phoneFormat(account.profile?.phone),
        },
        platform: req.body.platform,
        // Send total without payment fee
        // Even so, the return value of the api is the same as the total.payload + paymentFee
        total: transaction.total,
    };

    const paymentRequest = await paymentService.createRequest(payload);

    if (paymentRequest.data) {
        const data = Object.assign({}, paymentRequest.data);

        delete data["transaction_id"];
        delete data["status"];

        data["due"] = getMoment().add(1, "d").format("YYYY-MM-DD HH:mm:ss");

        await service.setPaymentData(transaction.id, {
            fee_pg: paymentFee,
            pg_transaction_id: paymentRequest.data.transaction_id,
            pg_data: data,
            status: "waiting",
        });

        service.sendEmailPayment({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: account.email,
            title: req.polyglot.t("mail.payment.created"),
            data: {
                name: transaction.client_data.fullname,
                platform: data.name,
                virtual_number: data.virtual_number,
                total: moneyFormat(data.amount),
                date: data.due,
            },
        });

        return res.jsonData(data);
    }

    return res.errorBadRequest();
};

exports.getPaymentDetail = async (req, res) => {
    const validate = validation.getPaymentDetail(req);
    if (validate.error) return res.errorValidation(validate.details);

    const data = await service.getAgentPaymentData(
        req.account._id,
        req.query.transaction_id
    );

    return res.jsonData(data);
};

exports.webhookMidtrans = async (req, res) => {
    const validate = validation.midtrans(req);
    if (validate.error) return res.errorValidation(validate.details);

    const transaction_id = req.body.transaction_id;
    const status = () => {
        switch (req.body.transaction_status) {
            case "settlement":
            case "capture":
                return "paid";

            case "deny":
                return "denied";

            case "cancel":
                return "canceled";

            case "failure":
                return "failed";
        }
    };

    const transaction = await service.getTransactionByPaymentId(transaction_id);
    if (transaction == null)
        return res.errorBadRequest(req.polyglot.t("error.transaction"));

    const result = status();
    const platform = paymentService.getPlatformName(transaction.pg_data.name);

    transaction.pg_data["date"] = getMoment().format("YYYY-MM-DD HH:mm:ss");

    await service.setPaymentStatus(transaction_id, {
        pg_data: transaction.pg_data,
        status: result,
    });

    if (result == "paid") {
        service.sendEmailPaymentSuccess({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: transaction.account.email,
            title: req.polyglot.t("mail.payment.success"),
            data: {
                name: transaction.account.firstname,
                platform: platform,
                total: moneyFormat(transaction.total),
                date: getMoment().format("D MMMM YYYY h:mm:ss"),
            },
        });
    }

    return res.jsonSuccess(req.polyglot.t("success.webhook.midtrans"));
};

exports.webhookXendit = async (req, res) => {
    const validate = validation.xendit(req);
    if (validate.error) return res.errorValidation(validate.details);

    const transaction_id = req.body.data.id;
    const status = () => {
        switch (req.body.data.status) {
            case "SUCCEEDED":
                return "paid";

            case "FAILED":
                return "denied";

            case "VOIDED":
                return "canceled";
        }
    };

    const transaction = await service.getTransactionByPaymentId(transaction_id);
    if (transaction == null)
        return res.errorBadRequest(req.polyglot.t("error.transaction"));

    const result = status();
    const platform = paymentService.getPlatformName(transaction.pg_data.name);

    transaction.pg_data["date"] = getMoment().format("YYYY-MM-DD HH:mm:ss");

    await service.setPaymentStatus(transaction_id, {
        pg_data: transaction.pg_data,
        status: result,
    });

    if (result == "paid") {
        service.sendEmailPaymentSuccess({
            host: process.env.REDIRECT_CLIENT || req.fullhost,
            target: transaction.account.email,
            title: req.polyglot.t("mail.payment.success"),
            data: {
                name: transaction.account.firstname,
                platform: platform,
                total: moneyFormat(transaction.total),
                date: getMoment().format("D MMMM YYYY h:mm:ss"),
            },
        });
    }

    return res.jsonSuccess(req.polyglot.t("success.webhook.xendit"));
};

<<<<<<< HEAD
exports.getComission = async (req, res) => {
    const comission = await service.getComission(req);

    res.jsonData(comission);
};

exports.getComissionHistory = async (req, res) => {
    const comission = await service.getComissionHistory(req);
=======
exports.getTransactionTotal = async (req, res) => {
    const total = await service.getTransactionTotal(req.account._id)

    return res.jsonData({ total: total })
}

exports.getComission = async (req, res) => {
    const comission = await service.getComission(req.account._id);
    if (comission.length <= 0) return res.jsonData({ total: 0 })

    return res.jsonData({ total: comission[0].value })
};

exports.getComissionHistory = async (req, res) => {
    const comission = await service.getComissionHistory(req.account._id);
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

    res.jsonData(comission);
};

exports.getPoint = async (req, res) => {
<<<<<<< HEAD
    const point = await service.getPoint(req);

    res.jsonData(point);
};

exports.getPointHistory = async (req, res) => {
    const point = await service.getPointHistory(req);
=======
    const point = await service.getPoint(req.account._id);
    if (point.length <= 0) return res.jsonData({ total: 0 })

    return res.jsonData({ total: point[0].value })
};

exports.getPointHistory = async (req, res) => {
    const point = await service.getPointHistory(req.account._id);
>>>>>>> 33aa20203ba527eae1a39cc4d087b92b78ebf8c3

    res.jsonData(point);
};

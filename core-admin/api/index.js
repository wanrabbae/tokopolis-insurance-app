const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const useragent = require("express-useragent");
const localeMiddleware = require("express-locale");

const app = express();
const polyglot = require("./utilities/polyglot");
const response = require("./utilities/response");

// Require API routes
const auth = require("./routes/auth.routes");
const users = require("./routes/users.routes");
const address = require("./routes/address.routes");
const vehicle = require("./routes/vehicle.routes");
const notification = require("./routes/notification.routes");
const product = require("./routes/product.routes");
const claim = require("./routes/claim.routes");
const transaction = require("./routes/transaction.routes");

const adminAuth = require("./routes/admin/auth.routes");
const adminAccount = require("./routes/admin/account.routes");
const adminProduct = require("./routes/admin/product.routes");
const adminVehicle = require("./routes/admin/vehicle.routes");
const adminRole = require("./routes/admin/role.routes");
const adminDealer = require("./routes/admin/dealer.routes");
const adminUser = require("./routes/admin/user.routes");
const adminClaim = require("./routes/admin/claim.routes");
const adminEndpoint = require("./routes/admin/endpoint.routes");
const adminTransaction = require("./routes/admin/transaction.routes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(useragent.express());
app.use(
    localeMiddleware({
        priority: ["default", "accept-language"],
        default: "id-ID",
    })
);
app.use(polyglot);
app.use(response);

app.use(
    auth,
    users,
    address,
    vehicle,
    product,
    transaction,
    notification,
    claim
);
app.use(
    adminAuth,
    adminAccount,
    adminProduct,
    adminVehicle,
    adminEndpoint,
    adminRole,
    adminDealer,
    adminTransaction,
    adminClaim,
    adminUser
);

module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`);
    });
}

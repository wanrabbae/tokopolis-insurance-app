// English US language

const en_US_strings = {
    validation: {
        "string.empty": `{{#label}} cannot be an empty field`,
        "string.min": `{{#label}} should have a minimum length of {#limit}`,
        "string.pattern.base": `{{#label}} format is not supported`,
        "any.required": `{{#label}} is a required field`,
        "any.only": `{{#label}} does not match`,
    },
    message: {
        field: {
            name: "Name",
            fullname: "Fullname",
            label: "Label",
            email: "Email",
            password: "Password",
            password_confirmation: "Password Confirmation",
            password_new: "New Password",
            token: "Token",
            photo: "Photo",
            gender: "Gender",
            birth_date: "Birth Date",
            address: "Address",
            phone: "Phone Number",
            city: "City",
            province: "Province",
            identity_type: "Identity Type",
            identity_number: "Identity Number",
            image: "Image",
            description: "Description",
            short_description: "Short Description",
            type: "Type",
            rate: "Rate",

            year: "Year",
            brand: "Brand",
            model: "Model",
            sub_model: "Sub Model",
            price: "Price",
            total: "Price Total",
            plate: "Plate",
            plate_detail: "Plate Detail",
            color: "Color",
            machine_number: "Machine Number",
            skeleton_number: "Skeleton Number",
            protection: "Protection",
            use: "Use",
            accessories: "Vehicle Accessories",
            start_date: "Start Date",
            leader_id: "Leader ID",
            region_id: "Region ID",
            province_id: "Province ID",
            city_id: "City ID",
            role_id: "Role ID",

            "address.village": "Village Address",
            "address.detail": "Address Detail",
            "address.use_to_ship": "Use of Address for Delivery",

            "product.id": "Product Id",
            "product.expansion": "Product Expansion",
            "product.discount.format": "Discount Format",
            "product.discount.total": "Discount Total",
            "product.tnc": "Terms and Condition",
            "product.claim": "Claim",
            "product.brochure": "Brochure",
            "product.workshop": "Workshop",
            "product.workshop_count": "Workshop Count",
            "product.extra_point": "Extra Poin",

            "transaction.id": "Transaction ID",
            "transaction.status": "Transaction Status",
            "transaction.condition": "Vehicle Condition",

            "transaction.client.fullname": "Nama Lengkap Pemegang Polis",
            "transaction.client.email": "Email Pemegang Polis",
            "transaction.client.phone": "Nomor Telepon Pemegang Polis",

            "transaction.bastk": "BASTK File",
            "transaction.identity": "Identity Photo",
            "transaction.stnk": "STNK Photo",
            "transaction.front": "Front Side Photo",
            "transaction.back": "Back Side Photo",
            "transaction.left": "Left Side Photo",
            "transaction.right": "Right Side Photo",
            "transaction.dashboard": "Dashboard Side Photo",
            "transaction.optional": "Optional Photo",

            "payment.platform": "Payment Platform",
            "endpoint.name": "Endpoint Name",
            "endpoint.route": "Route URL",
            "endpoint.method": "Method",
        },
        mail: {
            register: "Register Notification",
            login: "Login Notification",
            forget_password: "Forget Password Notification",
            email: "Email Verification",
            "payment.created": "Payment Notification",
            "payment.success": "Payment Success",
            verify_spv: "Supervisor Confirmation Notification",
        },
        success: {
            default: "Action Success",
            "webhook.midtrans": "Midtrans Webhook Success",
            "webhook.xendit": "Xendit Webhook Success",
        },
        error: {
            parameter: "Parameters not valid",
            auth: "Account not found",
            "email.exist": "Email already exists",
            "email.guest.exist": "Cannot use registered email",
            password: "Invalid password",
            token: "Invalid token",
            "token.null": "No token provided",
            "token.role": "Access not granted",
            identity: "Identity Number not Valid",
            "vehicle.data": "Vehicle Data not exists",
            "vehicle.price": "Vehicle Price not Valid",
            "vehicle.acc": "Vehicle Accessories not Valid",
            "vehicle.acc.price": "Vehicle Accessories Price not Valid",
            "vehicle.function": "Vehicle Function not Valid",
            "vehicle.protection": "Vehicle Protection not Valid",
            "vehicle.plate.new": "Vehicle Plate Detail is no need to fill",
            "vehicle.plate.old": "Vehicle Plate Detail is required",
            product: "Product not found",
            "product.data": "Product Data not exists",
            endpoint: "Endpoint not found",
            "endpoint.exist": "Endpoint already exist",
            "compare.product": "Product Comparation not Valid",
            transaction: "Transaction not exists",
            "transaction.create": "Transaction Failed",
            "route.exist": "Route already exists",
            "role.exist": "Role already exists",
            "endpoint.notfound": "Endpoint data not found.",
            "role.notfound": "Role data not found",
            "address.province": "Province data not found",
            "address.regency": "Regency data not found",
            "address.district": "District data not found",
            "address.village": "Village data not found",
        },
    },
};

module.exports.en_US_strings = en_US_strings;

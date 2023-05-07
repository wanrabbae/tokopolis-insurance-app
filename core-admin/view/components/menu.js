const role = require("../../../constants/roles")

export const menuItems = [
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: true,
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
            role.ROLE_AGENT,
        ]
    },
    {
        id: 2,
        label: "menuitems.dashboard.text",
        icon: "uil-home-alt",
        link: "/",
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
            role.ROLE_AGENT,
        ]
    },
    {
        id: 3,
        label: "menuitems.setting.text",
        isTitle: true,
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 4,
        label: "menuitems.config.text",
        icon: "uil-setting",
        link: "config-setting",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 5,
        label: "menuitems.permission.text",
        isTitle: true,
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 6,
        label: "menuitems.endpoint.text",
        icon: "uil-link",
        link: "/endpoint",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 7,
        label: "menuitems.role.text",
        icon: "uil-graph-bar",
        link: "/role",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 8,
        label: "menuitems.customer.text",
        isTitle: true,
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 9,
        label: "menuitems.dealer.text",
        icon: "uil-building",
        link: "/dealer",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 10,
        label: "menuitems.account.text",
        icon: "uil-user",
        link: "/account",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 11,
        label: "menuitems.upgrade.text",
        icon: "uil-users-alt",
        link: "/upgrade",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 12,
        label: "menuitems.verifybank.text",
        icon: "uil-file-check-alt",
        link: "verify-bank",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 13,
        label: "menuitems.verifyidentity.text",
        icon: "uil-file-check-alt",
        link: "verify-identity",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 14,
        label: "menuitems.sale.text",
        isTitle: true,
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
            role.ROLE_AGENT,
        ]
    },
    {
        id: 15,
        label: "menuitems.vehicle.text",
        icon: "uil-car",
        link: "/vehicle",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    // {
    //     id: 8,
    //     label: "menuitems.user.text",
    //     icon: "uil-invoice",
    //     subItems: [
    //         {
    //             id: 9,
    //             label: "menuitems.user.list.invoicelist",
    //             link: "/invoices/list",
    //             parentId: 8
    //         },
    //         {
    //             id: 20,
    //             label: "menuitems.user.list.invoicedetail",
    //             link: "/invoices/detail",
    //             parentId: 8
    //         }
    //     ]
    // },
    {
        id: 16,
        label: "menuitems.product.text",
        icon: "uil-box",
        link: "/products",
        role_id: [
            role.ROLE_ADMIN,
        ]
    },
    {
        id: 17,
        label: "menuitems.transaction.text",
        icon: "uil-car",
        link: "/transaction",
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
        ]
    },
    {
        id: 18,
        label: "menuitems.transactionHistory.text",
        icon: "uil-car",
        link: "/transaction-history",
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
        ]
    },
    {
        id: 19,
        label: "menuitems.claim.text",
        icon: "uil-money-withdrawal",
        link: "/claim",
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
        ]
    },
    {
        id: 20,
        label: "menuitems.pointandcommission.text",
        icon: "uil-dollar-alt",
        link: "/point-and-commission",
        role_id: [
            role.ROLE_ADMIN,
            role.ROLE_MANAGER,
            role.ROLE_BRANCH_HEAD,
            role.ROLE_SUPERVISOR,
            role.ROLE_AGENT,
        ]
    },
];


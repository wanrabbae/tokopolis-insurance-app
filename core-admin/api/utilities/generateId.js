import AccountService from "../services/AccountService.js";
import RoleService from "../services/RoleService.js";

const service = new AccountService();
const roleService = new RoleService();

export const generateDealerID = async (location_id) => {
    let unique_id = location_id; // already has a unique_id
    let other_id;

    const dealers = await service.getDealerAll();

    other_id = "01";

    if (dealers.length > 0) {
        const arrayOfOtherId = [];
        dealers.map((account) => arrayOfOtherId.push(account.other_id));

        const arrayOfNumbers = arrayOfOtherId.map(Number);
        const largest = Math.max.apply(0, arrayOfNumbers);
        other_id = (largest + 1).toString().padStart(2, "0");
    }

    unique_id += `-${other_id}`;

    return { unique_id, other_id };
};

export const generateIdRoleManagementWithUniqueId = async (payload) => {
    let unique_id = payload.unique_id; // already has a unique_id
    let other_id;

    const findRole = await roleService.getRoleById(payload.role_id);
    const accounts = await service.getAllAccountWithRoleId(role_id);

    console.log("accounts", accounts);

    if (!findRole) {
        // RIBUAN
        unique_id += "-01-01-01-001-001";
        other_id = "0001";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(4, "0");
        }

        unique_id += `-${other_id}`;

        return { unique_id, other_id };
    }

    switch (findRole.name) {
        case 'manager':
            // PULUHAN
            unique_id += "-01-01";
            other_id = "01";

            if (accounts.length > 0) {
                const arrayOfOtherId = [];
                accounts.map((account) =>
                    arrayOfOtherId.push(account.other_id)
                );

                const arrayOfNumbers = arrayOfOtherId.map(Number);
                const largest = Math.max.apply(0, arrayOfNumbers);
                other_id = (largest + 1).toString().padStart(2, "0");
            }

            unique_id += `-${other_id}`;
            break;

        case 'branch_head':
            // RATUSAN
            unique_id += "-01-01-01";
            other_id = "001";

            if (accounts.length > 0) {
                const arrayOfOtherId = [];
                accounts.map((account) =>
                    arrayOfOtherId.push(account.other_id)
                );

                const arrayOfNumbers = arrayOfOtherId.map(Number);
                const largest = Math.max.apply(0, arrayOfNumbers);
                other_id = (largest + 1).toString().padStart(3, "0");
            }

            unique_id += `-${other_id}`;
            break;

        case 'supervisor':
            // RATUSAN
            unique_id += "-01-01-01-001";
            other_id = "001";

            if (accounts.length > 0) {
                const arrayOfOtherId = [];
                accounts.map((account) =>
                    arrayOfOtherId.push(account.other_id)
                );

                const arrayOfNumbers = arrayOfOtherId.map(Number);
                const largest = Math.max.apply(0, arrayOfNumbers);
                other_id = (largest + 1).toString().padStart(3, "0");
            }

            unique_id += `-${other_id}`;
            break;

        default:
            // RIBUAN
            unique_id += "-01-01-01-001-001";
            other_id = "0001";

            if (accounts.length > 0) {
                const arrayOfOtherId = [];
                accounts.map((account) =>
                    arrayOfOtherId.push(account.other_id)
                );

                const arrayOfNumbers = arrayOfOtherId.map(Number);
                const largest = Math.max.apply(0, arrayOfNumbers);
                other_id = (largest + 1).toString().padStart(4, "0");
            }

            unique_id += `-${other_id}`;
            break;
    }

    return { unique_id, other_id };
};

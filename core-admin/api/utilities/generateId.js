import AccountService from "../services/AccountService.js";
import RoleService from "../services/RoleService.js";

const service = new AccountService();
const roleService = new RoleService();

export const generateIdRoleManagement = async (payload) => {
    const role_id = payload.role_id;
    let unique_id =
        payload.region_id.toString() +
        payload.province_id.toString() +
        payload.city_id.toString();
    let other_id;

    const findRole = await roleService.getRoleById(role_id);
    const accounts = await service.getAllAccountWithRoleId(findRole.id);

    if (findRole.name == "Operator Manager") {
        // PULUHAN
        unique_id += "-01-01";
        other_id = "01";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(2, "0");
        }

        unique_id += `-${other_id}`;
    } else if (findRole.name == "Branch Head") {
        // RATUSAN
        unique_id += "-01-01-01";
        other_id = "001";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(3, "0");
        }

        unique_id += `-${other_id}`;
    } else if (findRole.name == "Supervisor") {
        // RATUSAN
        unique_id += "-01-01-01-001";
        other_id = "001";

        if (accounts.length > 0) {
            const arrayOfOtherId = [];
            accounts.map((account) => arrayOfOtherId.push(account.other_id));

            const arrayOfNumbers = arrayOfOtherId.map(Number);
            const largest = Math.max.apply(0, arrayOfNumbers);
            other_id = (largest + 1).toString().padStart(3, "0");
        }

        unique_id += `-${other_id}`;
    } else {
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
    }

    return { unique_id, other_id };
};

export const generateIdRoleManagementWithUniqueId = async (payload) => {
    const role_id = payload.role_id;
    let unique_id = payload.unique_id; // already has a unique_id
    let other_id;

    const findRole = await roleService.getRoleById(role_id);
    const accounts = await service.getAllAccountWithRoleId(role_id);
    console.log("ACCOUNTS", accounts);
    if (findRole) {
        if (findRole.name == "Operator Manager") {
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
        } else if (findRole.name == "Branch Head") {
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
        } else if (findRole.name == "Supervisor") {
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
        } else {
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
        }
    } else {
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
    }

    return { unique_id, other_id };
};

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
    const role_id = payload.role_id

    let unique_id = payload.unique_id
    let other_id

    const findRole = await roleService.getRoleById(role_id)
    if (!findRole) return { unique_id: null, other_id: null }

    const accounts = await service.getLastAccountFromPrefixID(unique_id)

    if (findRole) {
        switch (findRole.name) {
            case "Operation Manager":
                unique_id += "-01"; // Auto 01
                other_id = "01";
                break;

            case "Kepala Cabang":
                other_id = "001";
                break;

            case "Supervisor":
                other_id = "001";
                break;

            default:
                other_id = "0001";
                break;
        }

        if (accounts) {
            other_id = (parseInt(accounts.other_id) + 1)
                .toString()
                .padStart(accounts.other_id.length, "0")
        }

        unique_id += `-${other_id}`
    }

    return {
        unique_id: unique_id,
        other_id: other_id
    }
}

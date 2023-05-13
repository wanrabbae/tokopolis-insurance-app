const ROLE_ADMIN = '682acea7-a7dd-456f-b7c7-c644caf7b67e'
const ROLE_MANAGER = 'be9a6374-a3e6-4f9d-b5e6-a518532586c1'
const ROLE_BRANCH_HEAD = '7251bc9f-7d8c-46bc-a2ae-2856bad76f54'
const ROLE_SUPERVISOR = '404503f4-a875-4ae3-a5ec-6d9f83a9e11d'
const ROLE_AGENT = 'd92aa720-c89e-4d3e-9070-64613bb33206'

const getIndexFromRoleID = (role_id) => {
    const list = [
        ROLE_ADMIN,
        ROLE_MANAGER,
        ROLE_BRANCH_HEAD,
        ROLE_SUPERVISOR,
        ROLE_AGENT,
    ]

    return list.findIndex(i == role_id)
}

const getRoleIDFromIndex = (index) => {
    const list = [
        ROLE_ADMIN,
        ROLE_MANAGER,
        ROLE_BRANCH_HEAD,
        ROLE_SUPERVISOR,
        ROLE_AGENT,
    ]

    return list[index - 1 >= list.length ? list.length - 1 : index - 1]
}

const getLeaderID = (subordinate_id) => {
    const rules = {
        [ROLE_BRANCH_HEAD]: ROLE_MANAGER,
        [ROLE_SUPERVISOR]: ROLE_BRANCH_HEAD,
        [ROLE_AGENT]: ROLE_SUPERVISOR,
    }

    return rules[subordinate_id]
}

const getSubordinateID = (leader_id) => {
    const rules = {
        [ROLE_MANAGER]: ROLE_BRANCH_HEAD,
        [ROLE_BRANCH_HEAD]: ROLE_SUPERVISOR,
        [ROLE_SUPERVISOR]: ROLE_AGENT,
    }

    return rules[leader_id]
}

module.exports = {
    ROLE_ADMIN,
    ROLE_MANAGER,
    ROLE_BRANCH_HEAD,
    ROLE_SUPERVISOR,
    ROLE_AGENT,

    getIndexFromRoleID,
    getRoleIDFromIndex,
    getLeaderID,
    getSubordinateID,
}
const { RoleType } = require('../roles/role_base');

const RoleDist = {
    1: {
        [RoleType.HARVESTER]: 2,
        [RoleType.UPGRADER]: 1,
    },
    2: {
        [RoleType.HARVESTER]: 3,
        [RoleType.UPGRADER]: 1,
        [RoleType.CONSTRUCTOR]: 2
    }
};

const RoleBody = {
    1: {
        [RoleType.HARVESTER]: {
            set_body: [CARRY, MOVE],
            fill_body: WORK,
        },
        [RoleType.UPGRADER]: {
            set_body: [CARRY, MOVE],
            fill_body: WORK
        },
        [RoleType.CONSTRUCTOR]: {
            set_body: [CARRY, MOVE],
            fill_body: WORK
        }
    },
    2: {
        [RoleType.HARVESTER]: {
            set_body: [CARRY, MOVE],
            fill_body: WORK,
        },
        [RoleType.UPGRADER]: {
            set_body: [CARRY, MOVE],
            fill_body: WORK
        },
        [RoleType.CONSTRUCTOR]: {
            set_body: [CARRY, MOVE],
            fill_body: WORK
        }
    },
}

module.exports = {RoleDist, RoleBody};
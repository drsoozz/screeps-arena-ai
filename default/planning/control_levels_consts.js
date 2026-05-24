const { RoleType } = require('../roles/role_base');

const RoleDist = {
    1: {
        [RoleType.UPGRADER]: 1,
    },
    2: {
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

/**
 * 
 * @param {Room} room 
 * @param {number} control_level 
 * @returns {Object}
 */
function getRoleDist(room, control_level) {
    const sources = room.find(FIND_SOURCES);
    const base = RoleDist[control_level];
    
    return {
        ...base,
        [RoleType.HARVESTER]: sources.length
    }
}

module.exports = {getRoleDist, RoleBody};
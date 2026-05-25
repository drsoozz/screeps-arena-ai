const { RoleType } = require('./roles.role_base');
const { FindSafeSources } = require('./utilities.find_safe_sources')
const RoleDist = {
    1: {
        [RoleType.UPGRADER]: 2,
        [RoleType.CONSTRUCTOR]: 1
    },
    2: {
        [RoleType.UPGRADER]: 3,
        [RoleType.CONSTRUCTOR]: 3
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
            set_body: [CARRY, CARRY, MOVE, MOVE],
            fill_body: WORK,
        },
        [RoleType.UPGRADER]: {
            set_body: [CARRY, CARRY, CARRY, MOVE],
            fill_body: WORK
        },
        [RoleType.CONSTRUCTOR]: {
            set_body: [CARRY, CARRY, MOVE, MOVE],
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
    
    const safeSources = FindSafeSources(room)
    const base = RoleDist[control_level];
    
    return {
        ...base,
        [RoleType.HARVESTER]: safeSources.length
    }
}



module.exports = {getRoleDist, RoleBody};
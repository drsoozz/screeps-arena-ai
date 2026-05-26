const { RoleType } = require('./roles.role_base');
const { FindSafeSources } = require('./utilities.find_safe_sources')
const RoleDist = {
    1: {
        [RoleType.UPGRADER]: 2,
        [RoleType.CONSTRUCTOR]: 0,
        [RoleType.REPAIRER]: 0
    },
    2: {
        [RoleType.UPGRADER]: 2,
        [RoleType.CONSTRUCTOR]: 3,
        [RoleType.REPAIRER]: 1
    },
    3: {
        [RoleType.UPGRADER]: 2,
        [RoleType.CONSTRUCTOR]: 4,
        [RoleType.REPAIRER]: 2
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
        },
        [RoleType.REPAIRER]: {
            set_body: [CARRY, MOVE, WORK],
            fill_body: null
        }
    },
    2: {
        [RoleType.HARVESTER]: {
            set_body: [CARRY, CARRY, MOVE, MOVE],
            fill_body: WORK,
        },
        [RoleType.UPGRADER]: {
            set_body: [WORK, WORK, CARRY, CARRY, MOVE],
            fill_body: null
        },
        [RoleType.CONSTRUCTOR]: {
            set_body: [CARRY, CARRY, MOVE, MOVE, WORK, WORK],
            fill_body: null
        },
        [RoleType.REPAIRER]: {
            set_body: [CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK],
            fill_body: null
        }
    },
    3: {
        [RoleType.HARVESTER]: {
            set_body: [CARRY, CARRY, MOVE, MOVE],
            fill_body: WORK,
        },
        [RoleType.UPGRADER]: {
            set_body: [WORK, WORK, CARRY, CARRY, MOVE],
            fill_body: null
        },
        [RoleType.CONSTRUCTOR]: {
            set_body: [CARRY, CARRY, MOVE, MOVE, WORK, WORK],
            fill_body: null
        },
        [RoleType.REPAIRER]: {
            set_body: [CARRY, MOVE, MOVE, MOVE, MOVE, WORK, WORK],
            fill_body: null
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
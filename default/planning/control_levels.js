const { RoleType } = require('../roles/role_base');

const CreepsDist = {
    1: {
        [RoleType.HARVESTER]: 2,
        [RoleType.UPGRADER]: 1,
    },
    2: {
        [RoleType.HARVESTER]: 3,
        [RoleType.UPGRADER]: 1,
        [RoleType.CONSTRUCTOR]: 2
    }
}